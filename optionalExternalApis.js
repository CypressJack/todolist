require("dotenv").config();
const e = require("express");
const { response } = require("express");
const request = require("request");
const keywords = require('./keywords');
const args = process.argv[2];

const generalSearch = function (query) {
  // Unique appId from Wolfram
  const appId = process.env.WOLFRAM_ID;
  // Encode query for URL insertion
  const encodedQuery = encodeURIComponent(query);
  // Wolfram Api URL
  const url = `http://api.wolframalpha.com/v2/query?appid=${appId}&input=${encodedQuery}&output=json`;
  // Avg query time for 'full-data' Wolfram endpoint is about 7.5 seconds
  request(url, function (error, response, body) {
    // Data 'pods' retrieved from the server
    const data = JSON.parse(body);
    const assumedTypes = data.queryresult.datatypes;
    // true or false if search in their db was successful
    console.log("assumed type:", assumedTypes);
    console.log("error:", error);
    console.log("statusCode:", response && response.statusCode);
    console.log("body:", data);
  });
};

const searchMovie = function (query) {
  // Example request https://api.themoviedb.org/3/movie/550?api_key=8eb5f5dee8a6b4179174ab1bb9af5f57
  // API Key
  const appKey = process.env.MOVIEDB_ID;
  // Encode query for URL insertion
  const encodedQuery = encodeURIComponent(query);
  // Movie search URL
  const url = `https://api.themoviedb.org/3/search/movie?api_key=${appKey}&query=${encodedQuery}`;
  request(url, function (error, response, body) {
    const data = JSON.parse(body);
    const firstEntry = data.results[0];
    const popularity = firstEntry.popularity;
    const receivedTitle = firstEntry.title;
    console.log("error:", error);
    console.log("statusCode:", response && response.statusCode);
    console.log("body:", firstEntry);
    console.log("popularity:", popularity);
  });
};

const bookSearch = function (query) {
  // example search GET https://www.googleapis.com/books/v1/volumes?q=flowers+inauthor:keyes&key=yourAPIKey
  const appKey = process.env.BOOKS_ID;
  // Encode query for URL insertion
  const encodedQuery = encodeURIComponent(query);
  const url = `https://www.googleapis.com/books/v1/volumes?q=${encodedQuery}&key=${appKey}`;
  request(url, function (error, response, body) {
    const data = JSON.parse(body);
    const totalItemsFound = data.totalItems;
    console.log("error:", error);
    console.log("statusCode:", response && response.statusCode);
    console.log("body:", data);
    console.log("total items", data.totalItems);
  });
};

// This function uses the SERP API to search google
const serpSearch = function (query) {
  const encodedQuery = query.replace(/\s/g, "+");
  console.log(encodedQuery);
  const appKey = process.env.SERP_ID;
  const url = `https://serpapi.com/search.json?engine=google&q=${encodedQuery}&location=Canada&google_domain=google.ca&gl=ca&hl=en&api_key=${appKey}`;
  request(url, function (error, response, body) {
    const data = JSON.parse(body);
    const receivedType = data.knowledge_graph.type;
    console.log("error:", error);
    console.log("statusCode:", response && response.statusCode);
    console.log("body:", body);
    console.log("google type:", receivedType);
    // Check if word novel is in google description
    if (receivedType.toLowerCase().includes("novel")) {
      console.log("added to book list");
    }
    if (receivedType.toLowerCase().includes("fruit")) {
      console.log("added to eat list");
    }
  });
};
