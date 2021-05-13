function userInformationHTML(user) {
    return `<h2>${user.name}
                <span class="small-name">
                    (@ <a href="${user.html_url}" target="_blank">${user.login}
                    </a>)
                </span>
            </h2>
            <div class="gh-content">
                <div class="gh-avatar">
                    <a href=""${user.html_url}" target="_blank">
                        <img src="${user.avatar_url}" width="80px" height="80px" alt="${user.login}">
                </div>
                <p>Followers: ${user.followers} - Following: ${user.following} <br> Repos: ${user.public_repos}</p>
            </div>
            `
}

function repoInformationHTML(repos) {
    if (repos.length == 0){
        return `<div class="clearfix repo-list">No Repos</div>`
    }
    var listItemsHTML = repos.map(function(repo) {
        return `<li>
                    <a href="${repo.html_url}" target="_blank">${repo.name}</a>
                </li>`;
    });
    return `<div class="clearfix repo-list">
                <p>
                    <strong>Repo List:</strong>
                </P>
            <ul>
                ${listItemsHTML.join("\n")}
            </ul>
            </div>`;s
}


function fetchGitHubInformation(event) {
    $("#gh-user-data").html("");    // When no username is entered, the div with id gh-user-date is empty
    $("#gh-repo-data").html("");    // When no username is entered, the div with id gh-repo-date is empty

    var username = $("#gh-username").val();
    if (!username) {
        $("#gh-user-data").html(`<h2>Please Enter a GitHub Username</h2>`);
        return;
    }

    $("#gh-user-data").html(
        `<div id="loader">
            <img src="assets/css/loader.gif" alt="loading..." />
        </div>`);

    $.when(
        $.getJSON(`https://api.github.com/users/${username}`),
        $.getJSON(`https://api.github.com/users/${username}/repos`)
    ).then(
        function(firstResponse, secondResponse) {
            var userData = firstResponse[0];
            var repoData = secondResponse[0];
            $('#gh-user-data').html(userInformationHTML(userData));
            $('#gh-repo-data').html(repoInformationHTML(repoData));
        }, function(errorResponse) {
            if (errorResponse.status === 404) {
                $('#gh-user-data').html(`<h2>No data found for user: ${username}</h2>`)
            } else if( errorResponse.status === 403) {                                              // APIs have limited, when they are exceeded, a 403 forbidden error 
                var resetTime = new Date(errorResponse.getResponseHeader('X-RateLimit-Reset')*1000);      // Variable resetTime is a Date object stored inside errorResponse
                $('#gh-user-data').html(`<h4>Too Many Requests, please wait until ${resetTime.toLocaleTimeString()}</h4>`);
            } else {
                console.log(console.errorResponse);
                $('#gh-user-data').html(
                    `<h2>Error: ${errorResponse.responseJSON.message}<h2>`);
            }
        });
    }

$(document).ready(fetchGitHubInformation);  //When the page loads, the value passed to fetchGitHubInformaiton is automaticaly searched