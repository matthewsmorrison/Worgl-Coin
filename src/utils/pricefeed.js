function get(url, newHeaders) {
	return fetch(url, {
		method: 'GET',
	});
}

function getJson(response) {
	return new Promise(resolve => {
		response.json().then(function (json) {
			resolve(json);
		});
	});
}

export async function getEthPrice() {
  let response = await get('https://api.coinmarketcap.com/v2/ticker/1027/?convert=USD');
  let json = await getJson(response);
  return json.data.quotes.USD.price;
}

export async function convertToUSD(ether, exchange) {
  var price = await getEthPrice();
  return price * exchange;
}
