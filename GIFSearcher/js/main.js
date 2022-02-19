// 1
  	window.onload = (e) => {document.querySelector("#search").onclick = searchButtonClicked};

    // 2
	let displayTerm = "";
    let pageNumber = 0;
    let currentDisplayedPage = "";
	
	// 3

    function searchButtonClicked(){
        console.log("searchButtonClicked() called");
		currentDisplayedPage = "searching";
        pageNumber = 0;
        pageManager();
	}

    function trendingButtonClicked() {
        currentDisplayedPage = "trending";
        pageNumber = 0;
        pageManager();
    }
	
    function getData(url){
        //1
        let xhr = new XMLHttpRequest();
        
        //2
        xhr.onload = dataLoaded;
        
        //3
        xhr.onerror = dataError;
        
        //4
        xhr.open("Get", url);
        xhr.send();
    }

    function getTrendingData(url){
        //1
        let xhr = new XMLHttpRequest();
        
        //2
        xhr.onload = trendingDataLoaded;
        
        //3
        xhr.onerror = dataError;
        
        //4
        xhr.open("Get", url);
        xhr.send();
    }
    
    function dataLoaded(e){
        //5
        let xhr = e.target;
        
        //6
        console.log(xhr.responseText);
        
        //7
        let obj = JSON.parse(xhr.responseText);
        
        //8
        if(!obj.data || obj.data.length == 0){
            document.querySelector("#Status").innerHTML = "<b>No results found for '" + displayTerm + "'</b>";
            return;
        }
        //9
        let results = obj.data;
        console.log("results.lenght = " + results.length);
        let bigString = "";
        
        //10
        for (let i = 0; i < results.length; i++){
            let result = results[i];
            
            //11
            let smallURL = result.images.fixed_width.url;
            if (!smallURL) smallURL = "../images/no-image-found.png"
            
            //12
            let url = result.url;
            
            //12.5
            let rating = (result.rating ? result.rating : "NA").toUpperCase();
            
            let title = result.title;
            title = title.split("GIF")[0];
            var source = result.source;
            source = source.split(".com")[0];
            source = source.substring(source.lastIndexOf(".") + 1)
            source = source.substring(source.lastIndexOf("/") + 1)
            if(source == ""){
                source = "Unknown";
            }
            
            //13
            let line = `<div class='result'>`;
            line += `<div class='titleOverlay'>`;
            line += `<img src = '${smallURL}' title = 'Source: ${source}' />`;
            line += `<div class="content"><div class="text"><p>${title}<br /></span>`;
            line+=`</div></div></div>`
            //line += `<p>Title: ${title}<br /></span>`;
            line+=`<span><a target = '_blank' href = '${url}'> View on Giphy</a><br />`;
            line += `<button onclick="copyURL('${url}')">Copy URL</button>`;
            line += `<p>Source: ${source}</span>`;
            //line += `</div>`;
            line += `</div>`;
            
            
            //15
            bigString +=line;
            
            //16
            document.querySelector("#content").innerHTML = bigString;
            
            //17
            document.querySelector("#status").innerHTML = "<b>Success!</b><p><i>Here are " + results.length + " results for '" + displayTerm + "'</i></p>";
        }
        
    }

    function trendingDataLoaded(e){
        //5
        let xhr = e.target;
        
        //6
        console.log(xhr.responseText);
        
        //7
        let obj = JSON.parse(xhr.responseText);
        
        //8
        if(!obj.data || obj.data.length == 0){
            document.querySelector("#Status").innerHTML = "<b>Can't find trending results</b>";
            return;
        }
        //9
        let results = obj.data;
        console.log("results.lenght = " + results.length);
        let bigString = "";
        
        //10
        for (let i = 0; i < results.length; i++){
            let result = results[i];
            
            //11
            let smallURL = result.images.fixed_width.url;
            if (!smallURL) smallURL = "images/no-image-found.png"
            
            //12
            let url = result.url;
            
            //12.5
            let rating = (result.rating ? result.rating : "NA").toUpperCase();
            
            let title = result.title;
            title = title.split("GIF")[0];
            var source = result.source;
            source = source.split(".com")[0];
            source = source.substring(source.lastIndexOf(".") + 1)
            source = source.substring(source.lastIndexOf("/") + 1)
            if(source == ""){
                source = "Unknown";
            }
            
            //13
            let line = `<div class='result'>`;
            line += `<div class='titleOverlay'>`;
            line += `<img src = '${smallURL}' title = 'Source: ${source}' />`;
            line += `<div class="content"><div class="text"><p>${title}<br /></span>`;
            line+=`</div></div></div>`
            //line += `<p>Title: ${title}<br /></span>`;
            line+=`<span><a target = '_blank' href = '${url}'> View on Giphy</a><br />`;
            line += `<button onclick="copyURL('${url}')">Copy URL</button>`;
            line += `<p>Source: ${source}</span>`;
            //line += `</div>`;
            line += `</div>`;
            
            
            //15
            bigString +=line;
            
            //16
            document.querySelector("#content").innerHTML = bigString;
            
            //17
            document.querySelector("#status").innerHTML = "<b>Success!</b><p><i>Here are the top " + results.length + " trending GIFs! </i></p>";
        }
        
    }

    function copyURL(url) {
        const copiedURL = document.createElement('input');
        copiedURL.setAttribute('value', url);
        document.body.appendChild(copiedURL);
        copiedURL.select();
        
        testOutput = document.execCommand("Copy", "false", "null")
        
        if (testOutput) {
            alert("URL copied successfully!");
        } 
        else {
            alert("URL has failed to copy &hellip;")
        }
    }   
    
    function dataError(e){
        console.log("An error occurred");
    }

    function pageManager(){
        if (currentDisplayedPage == "searching"){
            let GIPHY_URL = "https://api.giphy.com/v1/gifs/search?";
            let GIPHY_KEY = "iFYUjqM7V3yMZubdnXA7qYcPgvOTCIMC";
            let url = GIPHY_URL;
            url += "api_key=" + GIPHY_KEY;
            let term = document.querySelector("#searchterm").value;
            displayTerm = term;
            term = term.trim();
            term = encodeURIComponent(term);
            if(term.length < 1) return;
            url += "&q=" + term;
            let limit = document.querySelector("#limit").value;
            url += "&limit=" + limit;
            let offset = pageNumber * limit;
            url += "&offset=" + offset;
            document.querySelector("#status").innerHTML = "<b>Searching for '" + displayTerm + "'</b>";
            getData(url);  
        }
        else if (currentDisplayedPage == "trending"){
            let GIPHY_URL = "https://api.giphy.com/v1/gifs/trending?";
            let GIPHY_KEY = "iFYUjqM7V3yMZubdnXA7qYcPgvOTCIMC";
            let url = GIPHY_URL;
            url += "api_key=" + GIPHY_KEY;
            let limit = document.querySelector("#limit").value;
            url += "&limit=" + limit;
            let offset = pageNumber * limit;
            url += "&offset=" + offset;
            document.querySelector("#status").innerHTML = "Searching For Trending GIFs!";
            getTrendingData(url);  
        }
    }

    function backButtonClicked(){
        if(pageNumber >= 1){
            pageNumber--;
        }
        pageManager();
    }
    function forwardButtonClicked(){
        if(pageNumber < 100){
            pageNumber++;
        }
        pageManager();
    }

    function topFunction() {
        document.body.scrollTop = 0;
        document.documentElement.scrollTop = 0;
    }