import collections
import json
import math
import nltk
import numpy as np
import pandas as pd
import string
import re
import time
import tomllib
import urllib


"""Deprecated. Use the JavaScript version instead!
As I ported this to JavaScript, I found out that there are many bugs here.
"""


def truncate_company_name(name, /):
    """Truncates the name of a company. This works by:
    1. Removing the non-BMP characters U+10000..U+10FFFF (≈ emoji)
    2. Removing any suffixes present in config.toml
    3. Removing whitespace from the start or end of the result
    """
    name = re.sub(r"[\ufe0f\U00010000-\U0010ffff]", "", name)
    for suffix in suffixes:
        if name.casefold().endswith(suffix.casefold()):
            return name[:-len(suffix)].strip()
    return name.strip()


def extract_domain(url, /):
    """Extracts the domain name from a URL.
    Ported from AMG22075/domain-extractor.
    """
    cleaned_url = re.sub(r"(https?:\/\/)?(www?\d?\.)?", "", url)
    return urllib.parse.urlparse("https://" + cleaned_url).netloc


def normalize(value, /, *, min, max):
    """Normalizes a value as a linear interpolation coefficient,
    where the "min" provided maps to 0.0 and the "max" maps to 1.0.
    """
    return (value - min) / (max - min)


def weighted_average(values, weights):
    """Returns the sum of the products of values and weights,
    divided by the sum of just the weights.
    """
    weighted_sum = sum(values[key] * weights[key] for key in values)
    # don't include weights that aren't used, such as n<30 props
    total_weight = sum(weights[key] for key in values)
    return weighted_sum / total_weight


def mad_round(value, /):
    """Rounds a value to 1 decimal place, but rounds up if near .x5.
    It is intentionally unspecified how close "near" is.
    """
    return round(value + 1e-10, 1)

with open("config.toml", "rb") as f:
    config = tomllib.load(f)
    suffixes = config["suffixes"]
    minimum_n = config["significant-size-threshold"]  # normally 30
    
    score_weights = config["score-weights"]
    hype_attrs = score_weights["include-for-hype"]
    
    vocabularies = {}
    for category in config["vocabulary-datafiles"]:
        with open(config["vocabulary-datafiles"][category], "r") as file:
            vocabularies[category] = [line.strip() for line in file]
    
    # please export Sheet1 as .csv with a separator of ¿,
    # or change the settings accordingly
    df = pd.read_csv(config["datafile"], sep=config["datafile-sep"])

    total_exit_ratio = df.exit.sum() / len(df)  # currently about 10.4%

    value_counts = {}
    mad_params = {}
    deltas = {}
    for key in ["name_len", "_url-name", "_url_com", "age",
                        "_text_MAD", "url_len MAD", "_text_yr",
                        "_text_url", "_text_loc"]:
        value_counts[key] = df[key].value_counts()
        deltas[key] = {value: df[df[key] == value].exit.mean()
                                / total_exit_ratio - 1.0
                                for value in value_counts[key].keys()}
    for key in ["noun", "verb", "adj", "valu",
                *vocabularies]:
        vals = df[key+"_ratio"].values
        mad_params[key] = {
            "low": min(vals),
            "high": max(vals),
        }
        deltas[key+"_MAD"] = {
            n: df[((n-1)/20 < normalize(df[key+"_ratio"],
                                        min=min(vals), max=max(vals)))
                & ((n+1)/20 > normalize(df[key+"_ratio"],
                                        min=min(vals), max=max(vals)))]
                    .exit.mean()
                    / total_exit_ratio - 1.0
                for n in range(11)}

    for key in ["text_len", "url_len"]:
        mad_params[key] = {
            "low": min(df[key].values),
            "high": max(df[key].values),
        }
    
    # letter_min_freqs is all 0.0's but maybe that'll change
    letter_min_freqs = {letter.casefold(): df[letter].min()
                        for letter in string.ascii_uppercase}
    letter_max_freqs = {letter.casefold(): df[letter].max()
                        for letter in string.ascii_uppercase}

    # since the country exit data isn't in Sheet1 at all,
    # we have to export the dedicated sheet to another CSV,
    # and the different (already aggregated) format
    # makes it a lot more cursed to do it.
    # also we have to handle California specially which makes it even worse
    country_df = pd.read_csv(config["country-datafile"],
                           sep=config["datafile-sep"])
    country_deltas = {country if country != "(blank)" else None:
                country_df[country_df.COUNTRY == country]["Exit 1"].sum()
                / country_df[country_df.COUNTRY == country]["Population"].sum()
                / total_exit_ratio - 1.0
                for country in country_df.COUNTRY.values
                if country not in ["United States", "California"]}
    country_deltas["United States"] = (
        country_df[
                (country_df.COUNTRY == "United States")
                | (country_df.COUNTRY == "California")
            ]["Exit 1"].sum()
        / country_df[
                (country_df.COUNTRY == "United States")
                | (country_df.COUNTRY == "California")
            ]["Population"].sum()
        / total_exit_ratio - 1.0)
    region_deltas = {
        "United States":
            country_df[country_df.COUNTRY == "United States"]["Exit 1"].sum()
            / country_df[country_df.COUNTRY
                    == "United States"]["Population"].sum()
            / total_exit_ratio - 1.0,
        "California":
            country_df[country_df.COUNTRY == "California"]["Exit 1"].sum()
            / country_df[country_df.COUNTRY
                    == "California"]["Population"].sum()
            / total_exit_ratio - 1.0,
        "(blank)":
            country_df[country_df.COUNTRY == "(blank)"]["Exit 1"].sum()
            / country_df[country_df.COUNTRY == "(blank)"]["Population"].sum()
            / total_exit_ratio - 1.0,
        "Others":
            country_df[
                (country_df.COUNTRY != "United States")
                & (country_df.COUNTRY != "California")
                & (country_df.COUNTRY != "(blank)")]["Exit 1"].sum()
            / country_df[
                (country_df.COUNTRY != "United States")
                & (country_df.COUNTRY != "California")
                & (country_df.COUNTRY != "(blank)")]["Population"].sum()
            / total_exit_ratio - 1.0,
    }

    new_companies = config["companies"]


if __name__ == "__main__":
    nltk.download("punkt_tab", quiet=True)
    nltk.download("averaged_perceptron_tagger_eng", quiet=True)
    nltk.download("universal_tagset", quiet=True)
    for company in new_companies:
        output_data = {
            "name": company["name"].strip(),
            "description": {
                "value": company["description"].strip(),
            },
            "word_categories": {},
        }
        scores = {}
        
        truncated_name = truncate_company_name(company["name"].strip())
        description = company["description"].strip()
        output_data["truncated_name"] = truncated_name

        length = len(truncated_name)
        name_length_count = value_counts["name_len"][length]
        name_delta = deltas["name_len"][length]
        output_data["truncated_length"] = {
            "value": length,
            "sample_size": int(name_length_count),
            "nonstandard": bool(name_length_count < minimum_n),
        }
        if name_length_count >= minimum_n:
            output_data["truncated_length"]["exit_delta"] = name_delta
            scores["name"] = name_delta
        
        description_length = description.count(" ") + 1
        description_norm = normalize(description_length,
                                    min=mad_params["text_len"]["low"],
                                    max=mad_params["text_len"]["high"])
        description_length_count = len(df[df._text_MAD
                                        == mad_round(description_norm)])
        description_delta = deltas["_text_MAD"][mad_round(description_norm)]
        output_data["text_length"] = {
            "value": description_length,
            "sample_size": description_length_count,
            "nonstandard": description_length_count < minimum_n,
        }
        if description_length_count >= minimum_n:
            output_data["text_length"]["exit_delta"] = description_delta
            scores["text"] = description_delta

        url = extract_domain(company["url"])
        url_name = re.sub(r"\..*", "", url)
        url_match = (url_name.casefold()
                            == re.sub(r"\s", "", truncated_name.casefold()))
        url_com = ".com" in url
        url_length = len(url_name)
        url_norm = normalize(url_length, min=mad_params["url_len"]["low"],
                                        max=mad_params["url_len"]["high"])
        url_count = len(df[df["url_len MAD"] == mad_round(url_norm)])
        url_delta = deltas["url_len MAD"][mad_round(url_norm)]
        output_data["url"] = {
            "value": url,
            "implied_name": url_name,
            "length": url_length,
            "nonstandard": url_count < minimum_n,
            "name_match": url_match,
            ".com": url_com,
        }
        if url_count >= minimum_n:
            output_data["url"]["exit_delta"] = url_delta
            scores["url_len"] = url_delta

        country = company["country"]
        country_count = (country_df[country_df.COUNTRY == country]
                                ["Population"].sum())
        output_data["country"] = {
            "value": country,
            "sample_size": int(country_count),
            "nonstandard": bool(country_count < minimum_n),
        }
        # country delta doesn't have a weight listed, so don't include
        # it. now that we're using Git, the old version can be found by
        # going through the Git history, so "commenting it out" should
        # be avoided. additionally, there's nothing about Git that says
        # you can't use it before you have a certain minimum amount done
        # and it's often nice to start a project... when you start.

        founding_year = company["founded"]
        age = time.localtime(time.time()).tm_year - founding_year
        age_count = value_counts["age"][age]
        output_data["age"] = {
            "value": age,
            "sample_size": int(age_count),
            "nonstandard": bool(age_count < minimum_n),
        }
        if age_count >= minimum_n:
            try:
                age_delta = deltas["age"][age]
                output_data["age"]["exit_delta"] = age_delta
                scores["age"] = age_delta
            except KeyError:
                pass

        text_has_year = str(founding_year) in description
        output_data["description"]["has_year"] = text_has_year
        text_has_url = url in description
        output_data["description"]["has_url"] = text_has_url
        
        text_has_loc = (company["country"] in description
                        or (company["country"] == "California"
                            and "United States" in description))
        output_data["description"]["has_loc"] = text_has_loc
        
        letter_counts = collections.Counter(truncated_name.casefold())
        output_data["letter_counts"] = {letter: normalize(
                                    letter_counts[letter] / length,
                                    max=letter_max_freqs[letter],
                                    min=letter_min_freqs[letter])
                        for letter in string.ascii_lowercase}
        
        tagged_description = nltk.tag.pos_tag(
                                    nltk.tokenize.word_tokenize(description),
                                    tagset="universal")
        description_word_count = sum(c == " " for c in description.strip()) + 1
        for pos in ["adj", "verb", "noun", "valu"]:
            target_tag = "NUM" if pos == "valu" else pos.upper()
            pos_count = sum(tag == target_tag
                            for (word, tag) in tagged_description)
            pos_ratio = pos_count / description_word_count
            pos_norm = normalize(pos_ratio, min=mad_params[pos]["low"],
                                            max=mad_params[pos]["high"])
            pos_sample_size = len(df[df[pos+" MAD"]==mad_round(pos_norm)])
            output_data["word_categories"][pos] = {
                "count": pos_count,
                "ratio": pos_ratio,
                "normalized": pos_norm,
                "bucket": mad_round(pos_norm),
                "sample_size": pos_sample_size,
                "nonstandard": pos_sample_size < minimum_n,
            }
            if pos_sample_size >= minimum_n:
                pos_delta = deltas[pos+"_MAD"][round(mad_round(pos_norm)*10)]
                output_data["word_categories"][pos]["exit_delta"] = pos_delta
                scores[pos] = pos_delta
        for category in vocabularies:
            word_count = sum(description.casefold().count(word.casefold())
                                for word in vocabularies[category])
            word_ratio = word_count / description_word_count
            word_norm = normalize(word_ratio,
                                        min=mad_params[category]["low"],
                                        max=mad_params[category]["high"])
            word_sample_size = len(df[df[category+" MAD"]
                                        == mad_round(word_norm)])
            output_data["word_categories"][category] = {
                "count": word_count,
                "ratio": word_ratio,
                "normalized": word_norm,
                "bucket": mad_round(word_norm),
                "sample_size": word_sample_size,
                "nonstandard": word_sample_size < minimum_n,
            }
            if word_sample_size >= minimum_n:
                word_delta = (deltas[category+"_MAD"]
                                [round(mad_round(word_norm)*10)])
                output_data["word_categories"][category]["exit_delta"] = \
                                                                    word_delta
                scores[category] = word_delta
                
        
        output_data["total_score"] = weighted_average(values=scores,
                                                      weights=score_weights)
        output_data["hype_score"] = weighted_average(
            values={key: scores[key] for key in scores
                if key in hype_attrs},
            weights={key: score_weights[key] for key in scores
                if key in hype_attrs})
        print(json.dumps(output_data, indent=4))
