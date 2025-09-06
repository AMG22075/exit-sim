// Rewrite of company_analysis.py in JavaScript.
// Currently to be run in Node.js after running `npm install compromise`;
// however, I've structured it so that it shouldn't be too hard to move it to Retool.

const fs = require("fs"), nlp = require("compromise");

const companies = JSON.parse(fs.readFileSync("./Master 7419 MAD.json", 'utf-8'));
const countries = [{"COUNTRY":"United States","Exit 0":2550.0,"Exit 1":390.0,"Population":2940,"Exit ratio":"13.27%"},{"COUNTRY":"California","Exit 0":1718.0,"Exit 1":214.0,"Population":1932,"Exit ratio":"11.08%"},{"COUNTRY":"United Kingdom","Exit 0":377.0,"Exit 1":27.0,"Population":404,"Exit ratio":"6.68%","ExitRatio":"-35.61%"},{"COUNTRY":"Canada","Exit 0":293.0,"Exit 1":34.0,"Population":327,"Exit ratio":"10.40%"},{"COUNTRY":"India","Exit 0":197.0,"Exit 1":16.0,"Population":213,"Exit ratio":"7.51%","ExitRatio":"-27.62%"},{"COUNTRY":"(blank)","Exit 0":163.0,"Exit 1":1.0,"Population":164,"Exit ratio":"0.61%","ExitRatio":"-94.12%"},{"COUNTRY":"France","Exit 0":124.0,"Exit 1":9.0,"Population":133,"Exit ratio":"6.77%","ExitRatio":"-34.80%"},{"COUNTRY":"Germany","Exit 0":112.0,"Exit 1":12.0,"Population":124,"Exit ratio":"9.68%","ExitRatio":"-6.76%"},{"COUNTRY":"Israel","Exit 0":103.0,"Exit 1":9.0,"Population":112,"Exit ratio":"8.04%","ExitRatio":"-22.58%"},{"COUNTRY":"Mexico","Exit 0":91.0,"Exit 1":3.0,"Population":94,"Exit ratio":"3.19%","ExitRatio":"-69.25%"},{"COUNTRY":"Nigeria","Exit 0":89.0,"Exit 1":1.0,"Population":90,"Exit ratio":"1.11%","ExitRatio":"-89.29%"},{"COUNTRY":"Singapore","Exit 0":65.0,"Exit 1":4.0,"Population":69,"Exit ratio":"5.80%","ExitRatio":"-44.14%"},{"COUNTRY":"Australia","Exit 0":51.0,"Exit 1":1.0,"Population":52,"Exit ratio":"1.92%","ExitRatio":"-81.47%"},{"COUNTRY":"Brazil","Exit 0":47.0,"Exit 1":2.0,"Population":49,"Exit ratio":"4.08%","ExitRatio":"-60.67%"},{"COUNTRY":"Colombia","Exit 0":45.0,"Exit 1":1.0,"Population":46,"Exit ratio":"2.17%","ExitRatio":"-79.05%"},{"COUNTRY":"Netherlands","Exit 0":40.0,"Exit 1":3.0,"Population":43,"Exit ratio":"6.98%","ExitRatio":"-32.78%"},{"COUNTRY":"Spain","Exit 0":31.0,"Exit 1":6.0,"Population":37,"Exit ratio":"16.22%"},{"COUNTRY":"Italy","Exit 0":33.0,"Exit 1":1.0,"Population":34,"Exit ratio":"2.94%","ExitRatio":"-71.66%"},{"COUNTRY":"Ireland","Exit 0":29.0,"Exit 1":3.0,"Population":32,"Exit ratio":"9.38%","ExitRatio":"-9.67%"},{"COUNTRY":"Indonesia","Exit 0":29.0,"Exit 1":null,"Population":29,"Exit ratio":"0.00%"},{"COUNTRY":"United Arab Emirates","Exit 0":26.0,"Exit 1":null,"Population":26,"Exit ratio":"0.00%"},{"COUNTRY":"Norway","Exit 0":23.0,"Exit 1":2.0,"Population":25,"Exit ratio":"8.00%","ExitRatio":"-22.92%"},{"COUNTRY":"Argentina","Exit 0":21.0,"Exit 1":1.0,"Population":22,"Exit ratio":"4.55%","ExitRatio":"-56.20%"},{"COUNTRY":"Chile","Exit 0":21.0,"Exit 1":null,"Population":21,"Exit ratio":"0.00%"},{"COUNTRY":"Estonia","Exit 0":18.0,"Exit 1":3.0,"Population":21,"Exit ratio":"14.29%"},{"COUNTRY":"Kenya","Exit 0":20.0,"Exit 1":1.0,"Population":21,"Exit ratio":"4.76%","ExitRatio":"-54.12%"},{"COUNTRY":"Portugal","Exit 0":17.0,"Exit 1":3.0,"Population":20,"Exit ratio":"15.00%"},{"COUNTRY":"Switzerland","Exit 0":20.0,"Exit 1":null,"Population":20,"Exit ratio":"0.00%"},{"COUNTRY":"Poland","Exit 0":17.0,"Exit 1":1.0,"Population":18,"Exit ratio":"5.56%","ExitRatio":"-46.47%"},{"COUNTRY":"Denmark","Exit 0":16.0,"Exit 1":1.0,"Population":17,"Exit ratio":"5.88%","ExitRatio":"-43.32%"},{"COUNTRY":"Sweden","Exit 0":13.0,"Exit 1":3.0,"Population":16,"Exit ratio":"18.75%"},{"COUNTRY":"Peru","Exit 0":12.0,"Exit 1":1.0,"Population":13,"Exit ratio":"7.69%","ExitRatio":"-25.88%"},{"COUNTRY":"Egypt","Exit 0":12.0,"Exit 1":null,"Population":12,"Exit ratio":"0.00%"},{"COUNTRY":"Hong Kong","Exit 0":10.0,"Exit 1":2.0,"Population":12,"Exit ratio":"16.67%"},{"COUNTRY":"Pakistan","Exit 0":12.0,"Exit 1":null,"Population":12,"Exit ratio":"0.00%"},{"COUNTRY":"Finland","Exit 0":8.0,"Exit 1":3.0,"Population":11,"Exit ratio":"27.27%"},{"COUNTRY":"Ghana","Exit 0":11.0,"Exit 1":null,"Population":11,"Exit ratio":"0.00%"},{"COUNTRY":"Saudi Arabia","Exit 0":11.0,"Exit 1":null,"Population":11,"Exit ratio":"0.00%"},{"COUNTRY":"South Africa","Exit 0":10.0,"Exit 1":1.0,"Population":11,"Exit ratio":"9.09%","ExitRatio":"-12.41%"},{"COUNTRY":"Austria","Exit 0":8.0,"Exit 1":2.0,"Population":10,"Exit ratio":"20.00%"},{"COUNTRY":"Belgium","Exit 0":9.0,"Exit 1":1.0,"Population":10,"Exit ratio":"10.00%","ExitRatio":"-3.65%"},{"COUNTRY":"Japan","Exit 0":10.0,"Exit 1":null,"Population":10,"Exit ratio":"0.00%"},{"COUNTRY":"South Korea","Exit 0":10.0,"Exit 1":null,"Population":10,"Exit ratio":"0.00%"},{"COUNTRY":"Ukraine","Exit 0":7.0,"Exit 1":2.0,"Population":9,"Exit ratio":"22.22%"},{"COUNTRY":"Philippines","Exit 0":6.0,"Exit 1":2.0,"Population":8,"Exit ratio":"25.00%"},{"COUNTRY":"Vietnam","Exit 0":8.0,"Exit 1":null,"Population":8,"Exit ratio":"0.00%"},{"COUNTRY":"New Zealand","Exit 0":6.0,"Exit 1":null,"Population":6,"Exit ratio":"0.00%"},{"COUNTRY":"Slovenia","Exit 0":6.0,"Exit 1":null,"Population":6,"Exit ratio":"0.00%"},{"COUNTRY":"Hungary","Exit 0":5.0,"Exit 1":null,"Population":5,"Exit ratio":"0.00%"},{"COUNTRY":"Malaysia","Exit 0":5.0,"Exit 1":null,"Population":5,"Exit ratio":"0.00%"},{"COUNTRY":"Panama","Exit 0":5.0,"Exit 1":null,"Population":5,"Exit ratio":"0.00%"},{"COUNTRY":"Turkey","Exit 0":5.0,"Exit 1":null,"Population":5,"Exit ratio":"0.00%"},{"COUNTRY":"China","Exit 0":4.0,"Exit 1":null,"Population":4,"Exit ratio":"0.00%"},{"COUNTRY":"Ecuador","Exit 0":4.0,"Exit 1":null,"Population":4,"Exit ratio":"0.00%"},{"COUNTRY":"Jamaica","Exit 0":4.0,"Exit 1":null,"Population":4,"Exit ratio":"0.00%"},{"COUNTRY":"Latvia","Exit 0":4.0,"Exit 1":null,"Population":4,"Exit ratio":"0.00%"},{"COUNTRY":"Ethiopia","Exit 0":3.0,"Exit 1":null,"Population":3,"Exit ratio":"0.00%"},{"COUNTRY":"Morocco","Exit 0":2.0,"Exit 1":1.0,"Population":3,"Exit ratio":"33.33%"},{"COUNTRY":"Romania","Exit 0":3.0,"Exit 1":null,"Population":3,"Exit ratio":"0.00%"},{"COUNTRY":"Taiwan","Exit 0":3.0,"Exit 1":null,"Population":3,"Exit ratio":"0.00%"},{"COUNTRY":"Tanzania","Exit 0":3.0,"Exit 1":null,"Population":3,"Exit ratio":"0.00%"},{"COUNTRY":"Uganda","Exit 0":2.0,"Exit 1":1.0,"Population":3,"Exit ratio":"33.33%"},{"COUNTRY":"Uruguay","Exit 0":3.0,"Exit 1":null,"Population":3,"Exit ratio":"0.00%"},{"COUNTRY":"Bolivia","Exit 0":2.0,"Exit 1":null,"Population":2,"Exit ratio":"0.00%"},{"COUNTRY":"Cayman Islands","Exit 0":2.0,"Exit 1":null,"Population":2,"Exit ratio":"0.00%"},{"COUNTRY":"Croatia","Exit 0":2.0,"Exit 1":null,"Population":2,"Exit ratio":"0.00%"},{"COUNTRY":"Czechia","Exit 0":2.0,"Exit 1":null,"Population":2,"Exit ratio":"0.00%"},{"COUNTRY":"Georgia","Exit 0":2.0,"Exit 1":null,"Population":2,"Exit ratio":"0.00%"},{"COUNTRY":"Jordan","Exit 0":2.0,"Exit 1":null,"Population":2,"Exit ratio":"0.00%"},{"COUNTRY":"Lebanon","Exit 0":2.0,"Exit 1":null,"Population":2,"Exit ratio":"0.00%"},{"COUNTRY":"Luxembourg","Exit 0":2.0,"Exit 1":null,"Population":2,"Exit ratio":"0.00%"},{"COUNTRY":"Senegal","Exit 0":1.0,"Exit 1":1.0,"Population":2,"Exit ratio":"50.00%"},{"COUNTRY":"Venezuela","Exit 0":2.0,"Exit 1":null,"Population":2,"Exit ratio":"0.00%"},{"COUNTRY":"Armenia","Exit 0":1.0,"Exit 1":null,"Population":1,"Exit ratio":"0.00%"},{"COUNTRY":"Bahrain","Exit 0":1.0,"Exit 1":null,"Population":1,"Exit ratio":"0.00%"},{"COUNTRY":"Bangladesh","Exit 0":1.0,"Exit 1":null,"Population":1,"Exit ratio":"0.00%"},{"COUNTRY":"Benin","Exit 0":1.0,"Exit 1":null,"Population":1,"Exit ratio":"0.00%"},{"COUNTRY":"Bulgaria","Exit 0":1.0,"Exit 1":null,"Population":1,"Exit ratio":"0.00%"},{"COUNTRY":"Cameroon","Exit 0":1.0,"Exit 1":null,"Population":1,"Exit ratio":"0.00%"},{"COUNTRY":"Congo DRC","Exit 0":1.0,"Exit 1":null,"Population":1,"Exit ratio":"0.00%"},{"COUNTRY":"Costa Rica","Exit 0":1.0,"Exit 1":null,"Population":1,"Exit ratio":"0.00%"},{"COUNTRY":"C\u00f4te D'Ivoire","Exit 0":1.0,"Exit 1":null,"Population":1,"Exit ratio":"0.00%"},{"COUNTRY":"Cyprus","Exit 0":1.0,"Exit 1":null,"Population":1,"Exit ratio":"0.00%"},{"COUNTRY":"Greece","Exit 0":null,"Exit 1":1.0,"Population":1,"Exit ratio":"100.00%"},{"COUNTRY":"Iceland","Exit 0":1.0,"Exit 1":null,"Population":1,"Exit ratio":"0.00%"},{"COUNTRY":"Kosovo","Exit 0":1.0,"Exit 1":null,"Population":1,"Exit ratio":"0.00%"},{"COUNTRY":"Lithuania","Exit 0":1.0,"Exit 1":null,"Population":1,"Exit ratio":"0.00%"},{"COUNTRY":"Mongolia","Exit 0":1.0,"Exit 1":null,"Population":1,"Exit ratio":"0.00%"},{"COUNTRY":"Namibia","Exit 0":1.0,"Exit 1":null,"Population":1,"Exit ratio":"0.00%"},{"COUNTRY":"Puerto Rico","Exit 0":1.0,"Exit 1":null,"Population":1,"Exit ratio":"0.00%"},{"COUNTRY":"Seychelles","Exit 0":1.0,"Exit 1":null,"Population":1,"Exit ratio":"0.00%"},{"COUNTRY":"Sri Lanka","Exit 0":1.0,"Exit 1":null,"Population":1,"Exit ratio":"0.00%"},{"COUNTRY":"Trinidad and Tobago","Exit 0":1.0,"Exit 1":null,"Population":1,"Exit ratio":"0.00%"},{"COUNTRY":"Zambia","Exit 0":1.0,"Exit 1":null,"Population":1,"Exit ratio":"0.00%"}];

const suffixes = [
	" Inc.", " Inc",
	"L.L.C.", "L.L.C", "LLC",
	"L.L.P.", "L.L.P", "LLP",
	"K.K.", "K.K", "KK",
];
const minimumN = 40;
const scoreWeights = {
	age: 0.211881,
	text: 0.090783,
	noun: 0.087299,
	freq: 0.084873,
	verb: 0.079243,
	buzz: 0.072335,
	adj: 0.071054,
	jarg: 0.068354,
	name: 0.058280,
	url_len: 0.057975,
	valu: 0.036345,
	tags: 0.035831,
	loc_us: 0.028709,
	acro: 0.017038,
};
const vocabularies = {
	// /gi at the end of a regex stands for "global, ignore case"
	// where "global" means it can match more than once at a time
	// note that the acronyms regex is only /g, not /gi
	// | is "or"; none of the other characters used here have special meaning in regexes
	// simple strings are used as [compromise.cool] match tags instead
	noun: "#Noun",
	verb: "#Verb",
	adj: "#Adjective",
	valu: "#Value",
	acro: /AI|API|SaaS|B2B|ML|LLM|AR|CRM|IP|SMB|UI|IoT|VC|SDK|VR|SME|SQL|TAM|GPT|R&D|ROI|PC|ERP|ARR|NAS|DevOps|CV|UX|B2C|MRR|KPI|SEO|NLP|HTML|JS|CAC|MoM|GenAI|IPO|VM|GraphQL|CPU|CSS|HTML5|WiFi|ISP|HTTP|CMS|URL|ATM|CPA|POC|CLI|PaaS|LAN|LTV|DNS|CAGR|USP|LLC|NAT|SNA|AGI|CRUD|RTP|SNAP|WYSIWYG|JSON|NAC|SAM|SOM|CTR|NIC|POP|SSL|VPN|AES|BPO|MFA|MVP|OAuth|SERP|SSH|ACL|DSL|FAQ|IDF|IEEE|MAC|PCM|SOF|SYN|XML/g,
	buzz: /Your|Win|Vision|Valu|Utiliz|Unprecedent|Unparallel|Unique|Unicorn|Ultimat|Turn|Truth|Trust|Trend|Transform|Top|Thought|Surg|Super|Structur|Streamlin|Strateg|Start|Stand|Speed|Sophistic|Solv|Solution|Shap|Serv|Seamless|Scal|Robust|Revolut|Resolv|Resilien|Research|Relation|Record|Radical|Product|Problem|Predict|Power|Platform|Picture|performance|Partner|Paradigm|Orchestr|Optimiz|Operat|Only|Normal|Next|New|Never|Mov|Mission|Mind|Million|Meaning|Market|Lifecycle|Leverag|Level|Lead|Large|Invent|Intersect|Interact|Integrat|Innovat|Industr|Impact|Imagin|Idea|Huge|High|Harness|Grow|Green|Great|Global|Gamif|Forward|Forget|Forefront|Follow|Fluid|First|Fast|Facilitat|Extrem|Expon|Experienc|Execut|Enhanc|Engag|Enabl|Emerg|Elevat|Efficien|Edge|Econom|Dynam|Driv|Dive|Disrupt|Digit|Differ|Defens|Cultur|Cross|Creat|Complex|Compet|Circular|Charg|Chang|business|Buil|Broke|Bridg|Break|Brand|Boost|Billion|Big|Best|Assist|Allocat|Align|Agen|Advan|Add|Adapt|Action|acqui|Access|Accelerat/gi,
	freq: /platform|data|ai|companies|company|help|software|building|make|people|re|helps|time|use|technology|customers|world|app|build|teams|users|product|business|businesses|using|new|online|management|first|health|team|products|work|tools|digital|experience|access|provides|financial|create|customer|mobile|easy|better|solution|need|service|provide|services|learning|makes|sales|industry|manage|process|allows|market|enables|based|care|mission|content|system|built|including|video|making|marketplace|find|solutions|apps|social|analytics|faster|real|code|support|infrastructure|payments|developers|community|brands|real-time|design|web|revenue|global|money|marketing|investors|information|offers|million|api|simple|delivery|home|network|improve|patients|providing|capital|tool|scale|systems|development|combinator|helping|healthcare|food|cloud|leading|insights|founded|today|quality|own|payment|students|small|credit|tech|insurance|cost|saas|automate|applications|models|engineers|designed|personalized|local|security|offer|focus|connect|backed|ve|next|future|uses|live|single|engineering|now|enabling|take|smart|share|used|day|intelligence|user|right|enable|employees|save|performance|medical|creating|free|experiences|control|google|years|operations|modern|power|pay|growing|working|minutes|email|virtual|sell|fast|energy|easily|together|search|automation|place|human|application|startup|machine|automatically|costs|vision|reduce|india|space|open|increase|research|patient|year|run|currently|automated/gi,
	// "ve" made it in here somehow. I won't question it but the results won't be consistent with
	jarg: /App|Data|tech|Software|User|process|System|design|Engine|Analy|Web|Generat|Mobil|Shar|Network|info|Consum|Content|Cod|Social|Model|Intelligen|Cloud|Program|test|Conver|device|machin|Train|comput|Email|Communicat|Virtual|Search|identi|Securit|language|visual|Robot|Match|propert|Click|Block|Subscri|Hardware|site|Behavior|Core|type|Algo|edit|pack|brows|Interfac|Function|method|table|File|Select|Meta|Equip|storage|Sensor|electron|Native|Server|component|Version|Object|Library|Cyber|architect|Prompt|label|Instruct|Framework|Load|Hybrid|memor|chart|tablet|Stakeholder|query|Pattern|display|Protocol|Input|Backend|fragment|Bug|tag|math|calcul|rank|Loop|Grid|Output|element|domain|Resolution|Procedur|Agil|graphic|Mining|Pivot|Attribut|retriev|Frontend|Vector|statement|schema|Responsiv|entit|Classif|Neural|formul|Lean|infinit|variabl|Semant|Permission|Random/gi,
};

const totalExitRatio = companies.filter(c=>c.exit).length / companies.length;
let valueCounts = {}, exitRatios = {}, madParams = {};
for (const key of ["name_len", "_url-name", "_url_com", "age", "_text_MAD", "url_len MAD", "_text_yr", "_text_url", "_text_loc", "_tags_norm", ...Object.keys(vocabularies).map(v=>`${v} MAD`)]) {
	valueCounts[key] = {}; exitRatios[key] = {};
	let exitCounts = {};
	for (const company of companies) {
		valueCounts[key][company[key]] = (valueCounts[key][company[key]] ?? 0) + 1;
		exitCounts[company[key]] ??= 0;
		if (company.exit) ++exitCounts[company[key]];
	}
	for (const value in valueCounts[key]) {
		exitRatios[key][value] = exitCounts[value] / valueCounts[key][value];
	}
}
for (const key in vocabularies) {
	const vals = companies.map(c=>c[`${key}_ratio`]);
	madParams[key] = {min: Math.min(...vals), max: Math.max(...vals)};
}
for (const key of ["name_len", "text_len", "url_len", "tags", ..."ABCDEFGHIJKLMNOPQRSTUVWXYZ"]) {
	const vals = companies.map(c=>c[key]);
	madParams[key] = {min: Math.min(...vals), max: Math.max(...vals)};
}
valueCounts.country = {}; exitRatios.country = {};
valueCounts.loc_us = {"United States": 0, California: 0, [null]: 0, "(blank)": 0}; exitRatios.loc_us = {};
{
	let loc_usExitTable = {"United States": 0, California: 0, [null]: 0, "(blank)": 0};
	for (const record of countries) {
		let country, loc_us;
		switch (record.COUNTRY) {
			case "United States":
			case "California":
				loc_us = record.COUNTRY;
				country = "United States";
				break;
			case "(blank)":
				loc_us = country = record.COUNTRY;
				break;
			default:
				loc_us = null;
				country = record.COUNTRY;
		}
		valueCounts.country[record.COUNTRY] = record.Population;
		exitRatios.country[record.COUNTRY] = record["Exit 1"] / record.Population;
		loc_usExitTable[loc_us] += record["Exit 1"];
		valueCounts.loc_us[loc_us] += record.Population;
	}
	for (const loc_us in valueCounts.loc_us) {
		exitRatios.loc_us[loc_us] = loc_usExitTable[loc_us] / valueCounts.loc_us[loc_us];
	}
}

function truncateCompanyName(name) {
	name = name.replace(/[\ud800-\udfff\ufe0f]/g, "");
	for (let suffix of suffixes) {
		if (name.toLowerCase().endsWith(suffix.toLowerCase())) {
			return name.slice(0, -suffix.length).trim();
		}
	}
	return name.trim();
}

function extractDomain(inputURL) {
	const cleanedUrl = inputURL.replace(/^(https?:\/\/)?(www?\d?\.)?/g, "");
	const parsed = new URL("https://" + cleanedUrl);
	return parsed.hostname;
}

function normalize(value, { min, max }) {
	return (value - min) / (max - min);
}

function weightedAverage(values, weights) {
	let weightedSum = 0;
	let totalWeight = 0;
	for (let key in values) {
		weightedSum += values[key] * weights[key];
		totalWeight += weights[key];
	}
	return weightedSum / totalWeight;
}

function madRound(value) {
	return Math.round(value * 10 + 1e-10) / 10;
}

function exitRatioToDelta(ratio) {
	return ratio / totalExitRatio - 1;
}

function analyseCompany(company) {
	let result = {
		name: company.name.trim(),
		description: {
			value: company.description.trim(),
		},
		wordCategories: {},
	};
	let scores = {}, hypeScores = {};
	
	const truncatedName = truncateCompanyName(company.name.trim());
	{
		const nameLength = truncatedName.length;
		const nameLengthCount = valueCounts.name_len[nameLength] ?? 0;
		const nameLengthExitRatio = exitRatios.name_len[nameLength];
		result.name = {
			value: company.name.trim(),
			truncated: truncatedName,
			truncatedLength: nameLength,
			sampleSize: nameLengthCount,
			nonstandard: nameLengthCount < minimumN,
		};
		hypeScores.name = normalize(nameLength, madParams.name_len);
		if (nameLengthCount >= minimumN) result.name.exitRatio = scores.name = nameLengthExitRatio;
	}
	const url = extractDomain(company.url);
	{
		const urlName = url.replace(/\..*/, "");
		const urlLength = urlName.length, urlNorm = normalize(urlLength, madParams.url_len);
		const urlCount = valueCounts["url_len MAD"][madRound(urlNorm)] ?? 0;
		const urlExitRatio = exitRatios["url_len MAD"][madRound(urlNorm)];
		result.url = {
			value: url,
			impliedName: urlName,
			nameLength: urlLength,
			normalized: urlNorm,
			sampleSize: urlCount,
			nonstandard: urlCount < minimumN,
		};
		if (urlCount >= minimumN) result.url.exitRatio = scores.url_len = urlExitRatio;
		hypeScores.url_len = urlNorm;
	}
	const description = company.description.trim();
	{
		const descriptionLength = description.split(/\s/g).length;
		const descriptionNorm = normalize(descriptionLength, madParams.text_len);
		const descriptionCount = valueCounts._text_MAD[madRound(descriptionNorm)] ?? 0;
		const descriptionExitRatio = exitRatios._text_MAD[madRound(descriptionNorm)];
		result.description = {
			value: company.description.trim(),
			length: descriptionLength,
			normalized: descriptionNorm,
			sampleSize: descriptionCount,
			nonstandard: descriptionCount < minimumN,
		};
		if (descriptionCount >= minimumN) result.description.exitRatio = scores.text = descriptionExitRatio;
		hypeScores.text = descriptionNorm;
		const doc = nlp(company.description.trim());
		for (const pos in vocabularies) {
			const key = vocabularies[pos];
			// if key is a string, use it as a [compromise.cool] match tag in the NLP doc.
			// otherwise match a regex used as a word list (don't forget /g flag) to the description itself.
			const posCount = (typeof key === "string" ? doc : description).match(key)?.length ?? 0;
			const posRatio = posCount / descriptionLength;
			const posNorm = normalize(posRatio, madParams[pos]);
			const posSampleSize = valueCounts[`${pos} MAD`][madRound(posNorm)] ?? 0;
			const posExitRatio = exitRatios[`${pos} MAD`][madRound(posNorm)];
			result.wordCategories[pos] = {
				count: posCount,
				ratio: posRatio,
				normalized: posNorm,
				sampleSize: posSampleSize,
				nonstandard: posSampleSize < minimumN,
			};
			if (posSampleSize >= minimumN) result.wordCategories[pos].exitRatio = scores[pos] = posExitRatio;
			hypeScores[pos] = posNorm;
		}
	}
	{
		const country = company.country === "California" ? "United States" : company.country;
		const loc_us = ["United States", "California", "(blank)"].includes(company.country) ? company.country : null;
		const countryCount = valueCounts.country[country];
		result.country = {
			value: country,
			loc_us,
			sampleSize: countryCount,
			nonstandard: countryCount < minimumN,
			loc_usExitRatio: exitRatios.loc_us[loc_us],
		};
		scores.loc_us = exitRatios.loc_us[loc_us];
	} {
		const tagsCount = company.tags?.length ?? 0;
		const tagsNorm = normalize(tagsCount, madParams.tags);
		const tagsSampleSize = valueCounts._tags_norm[madRound(tagsNorm)] ?? 0;
		const tagsExitRatio = exitRatios._tags_norm[madRound(tagsNorm)];
		result.tags = {
			count: tagsCount,
			normalized: tagsNorm,
			sampleSize: tagsSampleSize,
			nonstandard: tagsSampleSize < minimumN,
		};
		if (tagsSampleSize >= minimumN) result.tags.exitRatio = scores.tags = tagsExitRatio;
		hypeScores.tags = tagsNorm;
	} {
		result.totalScore = weightedAverage(scores, scoreWeights);
		result.hypeScore = weightedAverage(hypeScores, scoreWeights);
	}
	return result;
}

console.log(analyseCompany({
	name: "Lombard Standard K.K.",
	description: "Description in approximately one sentence.",
	url: "lomb.st",
	country: "Japan",
	founded: 2025,
	tags: JSON.stringify,
}));
