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

window.onload = function() {
	LoadLatestStableBuilds();
}
