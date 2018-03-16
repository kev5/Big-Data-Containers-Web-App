const https = require("https");

var parseString = require('xml2js').parseString;

const demo_url = "https://demo.dataverse.org"

const actual_url = "https://demo.dataverse.org/dataverse/hbstest"

const search_uri = "/api/search"

const options = "?q=*&subtree=COSgak"

// Data Access API: access a data file or dataset using an ID; outlined in API spec
const access_uri = "/api/access/datafile/"

var file_id = "2453" // Got this one from the "trees" query

//const url = "https://api.twitter.com/1.1/search/tweets.json?q=%40twitterapi";

const url = actual_url + options;

const url2 = demo_url + access_uri + file_id;

const url3 = demo_url + search_uri + options;

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
    //body = JSON.parse(body);
    //var x = parseString(body, {async: true}, function (err, result) { console.dir(result); });
    //console.log(x);
    
    var stuff = body.slice( body.indexOf(find1), body.indexOf(find2) );
    //console.log(stuff);

    //while(true){
    //	try{
    		
    		var items = stuff.match(/<div class="card-title-icon-block">/g);
    		//console.log(items);


    		//console.log( stuff.slice( stuff.indexOf(find3), stuff.indexOf(find4) ) );
    		var tempstring = stuff.replace( stuff.slice( stuff.indexOf(find3), stuff.indexOf(find4) ), "" );
    		//console.log(tempstring);
    		//console.log( tempstring.slice( tempstring.indexOf(find3), tempstring.indexOf(find4) ) );

    //	}catch(TypeError){

    //	}
    //}
    //console.log( stuff.slice( stuff.indexOf(find3), stuff.indexOf(find4) ) );
    //console.log( body.slice( body.indexOf(find1), body.indexOf(find2) ) );
    

    //console.log(body[0])

  });
});


/*https.get(url2, res => {
  res.setEncoding("utf8");
  let body = "";
  res.on("data", data => {
    body += data;
  });
  res.on("end", () => {
    //body = JSON.parse(body);
    console.log(
      body
    );
  });
}); */

/*https.get(url3, res => {
  res.setEncoding("utf8");
  let body = "";
  res.on("data", data => {
    body += data;
  });
  res.on("end", () => {
    //body = JSON.parse(body);
    console.log(
      body
    );
  });
});*/


//This function allows you to iterate through many of the results that are generated from using the 
// Search API
function iter_pages_search(base, page, start){
	
	var condition = true;

	var start = start;

	var page = page;

	var rows = 10;

	var total;

	const url = base + "/api/search?q=*" + "&start=" + String(start);

	//console.log(url)

	https.get(url, res => {

  		res.setEncoding("utf8");
  		let body = "";
  		res.on("data", data => {
    		body += data;
  		});
  		res.on("end", () => {
    		body = JSON.parse(body);
    		//console.log(body['data']['items']);

    		//console.log("here")

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
function search_for_all(base, start, type){

	var condition = true;

	var start = start;

	var rows = 10;

	var total;

	var final = "";

	const url = base + "/api/search?q=*&type=" + type + "&start=" + String(start);

	//console.log(url)

	https.get(url, res => {

  		res.setEncoding("utf8");
  		let body = "";
  		res.on("data", data => {
    		body += data;
  		});
  		res.on("end", () => {
    		body = JSON.parse(body);
    		//console.log(body['data']['items']);

    		//console.log("here")

    		//console.log(body)

    		total = body['data']['total_count'];

			var i = 0;

			while( true ){
				try{
					//if( body['data']['items'][i]['name'] == query ){
						console.log( "- " + body['data']['items'][i]['name'] + "(" + body['data']['items'][i]['type'] + ")" + " url: " + body['data']['items'][i]['url']);
						//final = String(body['data']['items'][i]['url']);
						//console.log(final);
						//console.log(body['data']['items'][i]['url']);
						//start = total;
						//break;
					//}

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

	//while(condition){

	const url = base + "/api/search?q=*&type=" + type + "&start=" + String(start);

	//var body;

	//console.log(url)

	https.get(url, res => {

  		res.setEncoding("utf8");
  		let body = "";
  		res.on("data", data => {
    		body += data;
  		});
  		res.on("end", () => {
    		body = JSON.parse(body);
    		//console.log(body['data']['items']);

    		//console.log("here")

    		//console.log(body)

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

//iter_pages_search(demo_url, 1, 0)

//var returned_url = search_for_something(demo_url, 0, 'DatasetDiagram.png', 'file');
search_for_all(demo_url, 0, 'file')
//console.log(returned_url);


