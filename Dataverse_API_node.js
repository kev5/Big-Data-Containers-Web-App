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

    console.log( body.slice( body.indexOf(find1), body.indexOf(find2) ) )
    

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

//iter_pages_search(demo_url, 1, 0)

