
const https = require('https');
const http = require('http');
const fs = require("fs");
const axios = require('axios');
const FormData = require('form-data');

class WebService {
    statusCode;
    result;
    response;
    constructor() { }

    async invoke(params, options, postData = null) {


        var data = JSON.stringify(params);
        var url = 'http://'+options.host+':'+options.port+options.path;

        if (options.port == 443)
            url = 'https://'+options.host+options.path;

        var config = {
            method: options.method,
            url: url,
            headers: options.headers,
            data: data
        };

        let self = this;
		try {
			let response = await axios(config);
			self.result = response.data;

			return response.data;
		}
		catch(err)
		{
			console.log('** Connection failed ***',err);
		}
    }

    async upload(fileName, path,path2, options) {

        const title = fileName;

        var url = 'http://'+options.hostname+':'+options.port+options.path;

        if (options.port == 443)
            url = 'https://'+options.host+options.path;

  
        const form = new FormData();
        form.append('title', title);
        const fileContents = fs.createReadStream(path);
        form.append('file', fileContents);
        if (path2!==null)
            {
            const fileContents2 = fs.createReadStream(path2);
            form.append('file', fileContents2);
            }


        try {

            const response = await axios.post(url, form, {
              headers: options.headers    });

            console.log('Response Status:',response.status,response.data);
            return response.data;

        } 
        catch (error) {
            console.log('upload failed:',error.message);
            throw new Error(error.message);
/*
            if (error.response) { // get response with a status code not in range 2xx
              console.log(error.response.data);
              console.log(error.response.status);
              console.log(error.response.headers);
            } else if (error.request) { // no response
              console.log(error.request);
            } else { // Something wrong in setting up the request
              console.log('Error', error.message);
            }
            console.log(error.config); */
      }
    }

}
export {WebService }