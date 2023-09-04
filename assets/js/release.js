const RepoPath = "csprite/csprite";

// Returns Difference Between 2 Dates In Hours
function TimeDifference(date1, date2) {
	let a = moment(date1);
	let b = moment(date2);
	return a.diff(b, 'hours');
}

async function LoadLatestStableBuilds() {
	let downloadContent = document.getElementById("downloadContent");
	try {
		let GhReleases = localStorage.getItem(`GhReleases`);
		if (GhReleases) GhReleases = JSON.parse(GhReleases);
		if (!GhReleases || TimeDifference(new Date().getTime(), GhReleases.timestamp) >= 1) {
			console.log("No Valid Gh Releases Cache Found!");
			const response = await fetch(`https://api.github.com/repos/${RepoPath}/releases/latest`);
			GhReleases = await response.json();
			GhReleases.timestamp = new Date().getTime();
			localStorage.setItem(`GhReleases`, JSON.stringify(GhReleases));
		} else {
			console.log("Valid Gh Releases Found!");
		}

		downloadContent.innerHTML = `
<p>The current stable release of csprite is ${GhReleases.tag_name.substring(1, GhReleases.tag_name.length)} (${moment(GhReleases.published_at).fromNow()}).</p>
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
		downloadContent.innerHTML = `<p>Failed To Fetch Download Links, Go To <a href="https://github.com/${RepoPath}/releases/latest">GitHub Releases Page</a> Instead.</p>`;
	}
}

async function LoadLatestGitBuilds() {
	let downloadContentGit = document.getElementById("downloadContentGit");
	try {
		let GhReleasesGit = localStorage.getItem(`GhReleasesGit`);
		if (GhReleasesGit) GhReleasesGit = JSON.parse(GhReleasesGit);
		if (!GhReleasesGit || TimeDifference(new Date().getTime(), GhReleasesGit.timestamp) >= 1) {
			console.log("No Valid Gh Releases Git Cache Found!");
			const response = await fetch(`https://api.github.com/repos/${RepoPath}/releases/tags/latest-git`);
			GhReleasesGit = await response.json();
			GhReleasesGit.timestamp = new Date().getTime();
			localStorage.setItem(`GhReleasesGit`, JSON.stringify(GhReleasesGit));
		} else {
			console.log("Valid Gh Releases Git Found!");
		}

		downloadContentGit.innerHTML = `
<p>the latest git builds (${moment(GhReleasesGit.published_at).fromNow()}) of csprite provides latest features but the features might be un-documented & the builds might be unstable.</p>
<ul>`;
		for (var i = 0; i < GhReleasesGit.assets.length; i++) {
			downloadContentGit.innerHTML += `<li><a href="${GhReleasesGit.assets[i].browser_download_url}">${GhReleasesGit.assets[i].name}</a></li>`
		}
		downloadContentGit.innerHTML += `
<li><a href="${GhReleasesGit.zipball_url}">Source code (.zip)</a></li>
<li><a href="${GhReleasesGit.tarball_url}">Source code (.tar.gz)</a></li>
</ul>
<p>if above links aren't working, use this: <a href="https://github.com/${RepoPath}/releases/tag/latest-git" target="_blank">GitHub Releases</a>
`;
	} catch(err) {
		console.info(err);
		downloadContentGit.innerHTML = `<p><a href="https://github.com/${RepoPath}/releases/tag/latest-git" target="_blank">Download the latest git build</a> of csprite provides latest features but the features might be un-documented & the builds might be unstable.</p>`;
	}
}

window.onload = function() {
	LoadLatestStableBuilds();
	LoadLatestGitBuilds();
}

