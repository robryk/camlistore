/*
Copyright 2011 Google Inc.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

     http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

// Gets the |g| query parameter, assuming that it looks like a blobref.

function getPermanodeParam() {
    var blobRef = Camli.getQueryParam('g');
    return (blobRef && Camli.isPlausibleBlobRef(blobRef)) ? blobRef : null;
}

// pn: child permanode
// des: describe response of root permanode
function addMember(pn, des) {
    var membersDiv = document.getElementById("members");
    var ul;
    if (membersDiv.innerHTML == "") {
        membersDiv.appendChild(document.createTextNode("Members:"));
        ul = document.createElement("ul");
        membersDiv.appendChild(ul);
    } else {
        ul = membersDiv.firstChild.nextSibling;
    }
    var li = document.createElement("li");
    var a = document.createElement("a");
    a.href = "./?p=" + pn;
    var br = des[pn];
    var img = document.createElement("img");
    img.src = br.thumbnailSrc;
    img.height = br.thumbnailHeight;
    img.width =  br.thumbnailWidth;
    a.appendChild(img);
    li.appendChild(a);
    var title = document.createElement("p");
    Camli.setTextContent(title, camliBlobTitle(br.blobRef, des));
    title.className = 'camli-ui-thumbtitle';
    li.appendChild(title);
    li.className = 'camli-ui-thumb';
    ul.appendChild(li);
}

function onBlobDescribed(jres) {
    var permanode = getPermanodeParam();
    if (!jres[permanode]) {
        alert("didn't get blob " + permanode);
        return;
    }
    var permanodeObject = jres[permanode].permanode;
    if (!permanodeObject) {
        alert("blob " + permanode + " isn't a permanode");
        return;
    }

    document.getElementById('members').innerHTML = '';
    var members = permanodeObject.attr.camliMember;
    if (members && members.length > 0) {
        for (idx in members) {
            var member = members[idx];
            camliDescribeBlob(
                member,
                {
                    success: addMember(member, jres),
                    fail: function(msg) {
                        alert("Error describing blob " + blobref + ": " + msg);
                    }
                }
            );            
            
        }
    }
}

function buildGallery() {
    camliDescribeBlob(getPermanodeParam(), {
        thumbnails: 100, // requested size
        success: onBlobDescribed,
        failure: function(msg) {
            alert("failed to get blob description: " + msg);
        }
    });
}

function galleryPageOnLoad(e) {
    var permanode = getPermanodeParam();
    if (permanode) {
        document.getElementById('permanode').innerHTML = "<a href='./?p=" + permanode + "'>" + permanode + "</a>";
        document.getElementById('permanodeBlob').innerHTML = "<a href='./?b=" + permanode + "'>view blob</a>";
    }

    buildGallery();
}

window.addEventListener("load", galleryPageOnLoad);
