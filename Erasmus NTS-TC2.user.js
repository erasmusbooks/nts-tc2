// ==UserScript==
// @name				Erasmus NTS Title Check 2
// @namespace		*
// @description	Check if an ISBN exists in the Erasmus NTS database
// @include			http://*.*
// @include			https://*.*
// @exclude			http://www.erasmusbooks.nl/*.*
// @exclude			http://www.erasmus.fr/*.*
// @exclude			http://erasmusbooks.nl/*.*
// @exclude			http://erasmus.fr/*.*
// @version			2.0
// @grant				none
// ==/UserScript==

function scanIsbn () {

	var regexp = new RegExp("([0-9]?[0-9]?[0-9]?-?[0-9]-?[0-9]-?[0-9]-?[0-9]-?[0-9]-?[0-9]-?[0-9]-?[0-9]-?[0-9]-?[0-9A-Z])", "g"),
		snapshots = document.evaluate("//body//text()", document,null,XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,null);

	for (var num1 = 0; num1 < snapshots.snapshotLength; num1++) {
		regexp.lastIndex=0;
		
		var node1 = snapshots.snapshotItem(num1),
			match1 = regexp.exec(node1.textContent);

		if (match1) {
			var node2 = node1.parentNode,
				node3 = node1.nextSibling;

			node2.removeChild(node1);

			while (match1) {
				
				node2.insertBefore(document.createTextNode(RegExp.leftContext), node3);

				var span = document.createElement("span");
				span.className = 'erasmus-isbn-span';
				span.textContent=RegExp.$1 + " ";
				
				var img = document.createElement("img");			
				img.setAttribute("style","max-width: 10px;vertical-align: middle;");
				img.setAttribute("src","http://www.erasmusbooks.nl/check/images/loader.gif");							
				img.setAttribute("erasmus_loadingimg","true");	
				img.setAttribute("erasmus_isbn",RegExp.$1.replace("-",""));	
				img.className = 'erasmus-isbn-img';
				span.appendChild(img);
				
				try { node2.insertBefore(span, node3); }

				catch (ex) { node2.insertBefore(document.createTextNode(match1), node3); }

				regexp.lastIndex=0;
				
				match1=regexp.exec(RegExp.rightContext);
			}
			node2.insertBefore(document.createTextNode(RegExp.rightContext),node3);
		}
	}

	var element = document.querySelectorAll('[erasmus_loadingimg="true"]');
	
	for (var i = 0; i < element.length; i++) {
		var img = element[i];

		img.src = "http://www.erasmusbooks.nl/check/?ISBN=" + img.getAttribute("erasmus_isbn");
		img.setAttribute("erasmus_loadingimg", "false");
	}

	console.log('Finished Erasmus NTS Title Check');
}

window.onload = function () {
	console.log('Initial Finished Erasmus NTS Title Check');
	scanIsbn();
}	

document.onkeyup = function (e) {
	var e = e || window.event;

	if (e.ctrlKey && e.altKey && e.which == 73) {
		console.log('Launching new Erasmus NTS Title Check');

		var imgs = document.getElementsByClassName('erasmus-isbn-img');
		while (imgs.length > 0) {
			imgs[0].parentNode.removeChild(imgs[0]);
		}

		var spans = document.getElementsByClassName('erasmus-isbn-span');

		while	(spans.length) {
			var parent = spans[0].parentNode;
			
			while	(spans[0].firstChild) {
				parent.insertBefore(spans[0].firstChild, spans[0]);
			}

			parent.removeChild(spans[0]);
		}

		scanIsbn();
			
		return false;
	}
}