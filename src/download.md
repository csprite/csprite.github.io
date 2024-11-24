---
title Download
date
last_modified_at
---

<noscript>
	<p>This page relies on JavaScript for fetching binaries, If you don't want to enable JavaScript you can download the binaries at <a href="https://github.com/csprite/csprite/releases">Github Releases</a></p>
</noscript>

<div style="display: none;" id="downloadContent">
	<p>Loading...</p>
</div>
<div style="display: none;" id="downloadContentGit">
	<p>Loading...</p>
</div>

<script src="/lib/moment-2.30.1/moment.min.js" async></script>
<script async>
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

		let myList = document.createElement("ul");
		GhReleases.assets.push({ browser_download_url: GhReleases.zipball_url, name: "Source code (.zip)" });
		GhReleases.assets.push({ browser_download_url: GhReleases.tarball_url, name: "Source code (.tar.gz)" });
		for (var i = 0; i < GhReleases.assets.length; i++) {
			let myListItem = document.createElement("li");
			myListItem.innerHTML += `<a href="${GhReleases.assets[i].browser_download_url}">${GhReleases.assets[i].name}</a>`
			myList.appendChild(myListItem);
		}

		downloadContent.innerHTML = `
			<h2>Latest Stable Builds</h2>
			<p>The current stable release of csprite is ${GhReleases.tag_name.substring(1, GhReleases.tag_name.length)} (${moment(GhReleases.published_at).fromNow()}).</p>
			${myList.outerHTML}
		`.trim();
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

		let myList = document.createElement("ul");
		GhReleasesGit.assets.push({ browser_download_url: GhReleasesGit.zipball_url, name: "Source code (.zip)" });
		GhReleasesGit.assets.push({ browser_download_url: GhReleasesGit.tarball_url, name: "Source code (.tar.gz)" });
		for (var i = 0; i < GhReleasesGit.assets.length; i++) {
			let myListItem = document.createElement("li");
			myListItem.innerHTML = `<a href="${GhReleasesGit.assets[i].browser_download_url}">${GhReleasesGit.assets[i].name}</a>`;
			myList.appendChild(myListItem);
		}

		downloadContentGit.innerHTML = `
			<h2>Latest Git Builds</h2>
			<p>the latest git builds (${moment(GhReleasesGit.published_at).fromNow()}) of csprite provides latest features but the features might be un-documented & the builds might be unstable.</p>
			${ myList.outerHTML }
			<p>If above links aren't working, You can download directly from <a href="https://github.com/${RepoPath}/releases/tag/latest-git" target="_blank">GitHub Releases</a>.</p>
		`.trim();
	} catch(err) {
		console.info(err);
		downloadContentGit.innerHTML = `<p><a href="https://github.com/${RepoPath}/releases/tag/latest-git" target="_blank">Download the latest git build</a> of csprite provides latest features but the features might be un-documented & the builds might be unstable.</p>`;
	}
}

window.addEventListener("load", function() {
	document.getElementById("downloadContent").style.display = "unset";
	document.getElementById("downloadContentGit").style.display = "unset";
	LoadLatestStableBuilds();
	LoadLatestGitBuilds();
});
</script>
