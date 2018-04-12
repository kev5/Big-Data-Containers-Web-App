var https = require("https");

var parseString = require('xml2js').parseString;

var demo_url = "https://demo.dataverse.org";

var actual_url = "https://demo.dataverse.org/dataverse/hbstest";

var search_uri = "/api/search";

var options = "?q=*&subtree=COSgak";

// Data Access API: access a data file or dataset using an ID; outlined in API spec
var access_uri = "/api/access/datafile/";

var file_id = "2453"; // Got this one from the "trees" query

var url = actual_url + options;

var url2 = demo_url + access_uri + file_id;

var url3 = demo_url + search_uri + options;

var find1 = "<!--DATAVERSE CARDS-->";
var find2 = "</table>";
var find3 = "<a href=";
var find4 = "</span></a>";
var find5 = '<div class="card-title-icon-block">'


https.get(url, res => {
  //console.log(url)
  res.setEncoding("utf8");
  let body = "";
  res.on("data", data => {
    body += data;
  });
  res.on("end", () => {
    
    var stuff = body.slice( body.indexOf(find1), body.indexOf(find2) );
	  
    		var items = stuff.match(/<div class="card-title-icon-block">/g);
    		
    		var tempstring = stuff.replace( stuff.slice( stuff.indexOf(find3), stuff.indexOf(find4) ), "" );
  });
});

//This function allows you to iterate through many of the results that are generated from using the 
// Search API
function iter_pages_search(base, page, start){
	
	var condition = true;

	var start = start;

	var page = page;

	var rows = 10;

	var total;

	const url = base + "/api/search?q=*" + "&start=" + String(start);

	https.get(url, res => {

  		res.setEncoding("utf8");
  		let body = "";
  		res.on("data", data => {
    		body += data;
  		});
  		res.on("end", () => {
    		body = JSON.parse(body);

    		total = body['data']['total_count'];

			console.log( "=== Page " + page + " ===");
			console.log( "start: " + start + " total: " + total);

			var i = 0;

			while( true ){
				try{
					console.log( "- " + body['data']['items'][i]['name'] + "(" + body['data']['items'][i]['type'] + ")");
					i+=1;
				}
				catch(TypeError){
					break
				}

			}

			start += rows;
			page += 1;

			if( start < total ){

				iter_pages_search(base, page, start);
			}
			else{
				return 0;
			}


  		});
	});


}

//Function which searches for something within its type (file, dataset, dataverse) and returns all of the urls of objects
// with that type
window.search_for_all = function (base, start, type, print_dst){

	var condition = true;

	var start = start;
    
        var op = document.getElementById(print_dst || "output");

	var rows = 10;

	var total;

	var final = "";

	const url = base + "/api/search?q=*&type=" + type + "&start=" + String(start);

	https.get(url, res => {

  		res.setEncoding("utf8");
  		let body = "";
  		res.on("data", data => {
    		body += data;
  		});
  		res.on("end", () => {
    		body = JSON.parse(body);
			
    		total = body['data']['total_count'];

			var i = 1;
            

			while( true ){
				try{
                    li = document.createElement('li');
                    link = document.createElement('a');
                    link.appendChild(document.createTextNode(String(i)+". " + body['data']['items'][i]['name'] + "(" + body['data']['items'][i]['type'] + ")\n"));
                    link.href = body['data']['items'][i]['url'];
                    link.target = "_blank";
                    li.appendChild(link);
                    op.appendChild(li);

					i+=1;
				}
				catch(TypeError){
					break;
				}

			}

			start += rows;

			if( start < total ){

				search_for_all(base, start, type);
			}
			else{
				//return console.log(final);
				//return(final);
				return 0;
				
			}

  		});
	});
}

//Function which searches for something within its type (file, dataset, dataverse) and returns the url
function search_for_something(base, start, query, type){
	
	var condition = true;

	var start = start;

	var rows = 10;

	var total;

	var final = "";

	const url = base + "/api/search?q=*&type=" + type + "&start=" + String(start);

	https.get(url, res => {

  		res.setEncoding("utf8");
  		let body = "";
  		res.on("data", data => {
    		body += data;
  		});
  		res.on("end", () => {
    		body = JSON.parse(body);

    		total = body['data']['total_count'];

			var i = 0;

			while( true ){
				try{
					if( body['data']['items'][i]['name'] == query ){
						//console.log( "- " + body['data']['items'][i]['name'] + "(" + body['data']['items'][i]['type'] + ")" + " url: " + body['data']['items'][i]['url']);
						final = String(body['data']['items'][i]['url']);
						console.log(final);
						//console.log(body['data']['items'][i]['url']);
						start = total;
						break;
					}

					i+=1;
				}
				catch(TypeError){
					break;
				}

			}

			start += rows;

			if( start < total ){

				search_for_something(base, start, query);
			}
			else{
				//return console.log(final);
				//return(final);
				return 0;
				
			}

  		});
	});


}

},{"https":7,"xml2js":49}]},{},[73]);
