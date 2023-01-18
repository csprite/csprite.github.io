// Returns Difference Between 2 Dates In Hours
function TimeDifference(date1, date2) {
	return Math.abs(date1 - date2) / 36e5; // 36e5 = 60 * 60 * 1000
}

async function LoadLatestStableBuilds() {
	let downloadContent = document.getElementById("downloadContent");
	try {
		let GhReleases = localStorage.getItem(`GhReleases`);
		if (GhReleases) GhReleases = JSON.parse(GhReleases);
		if (!GhReleases || TimeDifference(new Date().getTime(), GhReleases.timestamp) >= 1) {
			console.log("No Valid Gh Releases Cache Found!");
			const response = await fetch("https://api.github.com/repos/pegvin/csprite/releases/latest");
			GhReleases = await response.json();
			GhReleases.timestamp = new Date().getTime();
			localStorage.setItem(`GhReleases`, JSON.stringify(GhReleases));
		} else {
			console.log("Valid Gh Releases Found!");
		}

		downloadContent.innerHTML = `
<p>The current stable release of csprite is ${GhReleases.tag_name.substring(1, GhReleases.tag_name.length)} (${GhReleases.published_at}).</p>
<ul>`;
		for (var i = 0; i < GhReleases.assets.length; i++) {
			downloadContent.innerHTML += `<li><a href="${GhReleases.assets[i].browser_download_url}">${GhReleases.assets[i].name}</a></li>`
		}
		downloadContent.innerHTML += `
<li><a href="${GhReleases.zipball_url}">Source code (.zip)</a></li>
<li><a href="${GhReleases.tarball_url}">Source code (.tar.gz)</a></li>
</ul>
`;
	} catch(err) {
		console.info(err);
		downloadContent.innerHTML = `<p>Failed To Fetch Download Links, Go To <a href="https://github.com/pegvin/csprite/releases/latest">GitHub Releases Page</a> Instead.</p>`;
	}
}

async function LoadLatestGitBuilds() {
	let downloadContent = document.getElementById("downloadContentGit");
	try {
		let RunInformation = localStorage.getItem(`LatestGitBuilds`);
		if (RunInformation) RunInformation = JSON.parse(RunInformation);
		if (!RunInformation || TimeDifference(new Date().getTime(), RunInformation.timestamp) >= 1) {
			console.log("No Valid Run Information Cache Found!");
			const runs_response = await fetch("https://api.github.com/repos/pegvin/csprite/actions/runs");
			const runs_json = await runs_response.json();
			for (var i = 0; i < runs_json.workflow_runs.length; i++) {
				if (runs_json.workflow_runs[i].conclusion == "success" && runs_json.workflow_runs[i].head_branch == "master") {
					RunInformation = runs_json.workflow_runs[i];
					break;
				}
			}
			if (RunInformation == null) {
				throw new Error("Cannot find a successful workflow run!");
			}

			const response = await fetch(RunInformation.artifacts_url);
			const json = await response.json();
			RunInformation.html_url = json.html_url;
			RunInformation.timestamp = new Date().getTime();
			localStorage.setItem(`LatestGitBuilds`, JSON.stringify(RunInformation));
		} else {
			console.log("Valid Run Information Found!");
		}

		downloadContent.innerHTML = `<p><a href="${RunInformation.html_url}" target="_blank">Download the latest git build</a> of csprite (${RunInformation.created_at}) provides latest features but the features might be un-documented & the builds might be unstable.</p>`;
	} catch(err) {
		console.info(err);
		downloadContent.innerHTML = `<p>Failed To Fetch Download Links, Go To <a href="https://github.com/pegvin/csprite/actions/workflows/ci.yml">ci.yml - GitHub Actions</a> page & click on the latest run with green tick, scroll-down a little & download your desired build.</p>`;
	}
}

window.onload = function() {
	LoadLatestStableBuilds();
	LoadLatestGitBuilds();
}
