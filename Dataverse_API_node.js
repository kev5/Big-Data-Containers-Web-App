const https = require("https");

var parseString = require('xml2js').parseString;


const demo_url = "https://demo.dataverse.org"

const actual_url = "https://demo.dataverse.org/dataverse/hbstest"

const search_uri = "/api/search"

const options = "?q=*"

// Data Access API: access a data file or dataset using an ID; outlined in API spec
const access_uri = "/api/access/datafile/"

var file_id = "2453" // Got this one from the "trees" query

//const url = "https://api.twitter.com/1.1/search/tweets.json?q=%40twitterapi";

const url = actual_url + options;

const url2 = demo_url + access_uri + file_id;

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


//This function allows you to iterate through many of the results that are generated from using the 
// Search API
function iter_pages_search(base, page, start){
	
	var condition = true;

	var start = start;

	var page = page;

	var rows = 10;

	var total;

	//while(condition){

	const url = base + "/api/search?q=*" + "&start=" + String(start);

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

			/*
			for (var i = 0; i < total; i++) {
				console.log( "- " + body['data']['items'][i]['name'] + "(" + body['data']['items'][i]['type'] + ")");
			}*/

			start += rows;
			page += 1;

			/*console.log("this is page " + page + ", this is start " + start + ", this is total " + total);

			if( page == 5 ){
				return 0;
			}*/

			if( start < total ){

				iter_pages_search(base, page, start);
			}
			else{
				return 0;
			}

			//condition = start < total;


  		});
	});

	//console.log("this is page " + page + ", this is start " + start + ", this is total " + total);
	

		
	//}

}

function search_for_something(base, start, query){
	
	var condition = true;

	var start = start;

	var rows = 10;

	var total;

	var final = "";

	array = [];

	//while(condition){

	const url = base + "/api/search?q=*" + "&start=" + String(start);

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

    		total = body['data']['total_count'];

			var i = 0;

			while( true ){
				try{
					if( body['data']['items'][i]['name'] == query ){
						//console.log( "- " + body['data']['items'][i]['name'] + "(" + body['data']['items'][i]['type'] + ")" + " url: " + body['data']['items'][i]['url']);
						final = String(body['data']['items'][i]['url']);
						
						array.push(final);
						//console.log(final);
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
				console.log(final);
				//console.log("here");
				//return(final);
				
			}


  		});
	});
	/*
	if(array.length == 0){
		setTimeout(function(){ console.log("Hello"); }, 3000);
		return array;
	}
	*/
	
}


//iter_pages_search(demo_url, 1, 0)

var returned_url = search_for_something(demo_url, 0, 'Cayley Graphs');
//console.log(returned_url);


