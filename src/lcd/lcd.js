
export async function getAddressInfo(url, address) {
  var info = await fetch(url + '/auth/accounts/' + address, {
    method: 'GET',
    headers: {
       'Content-Type' : 'application/x-www-form-urlencoded; charset=UTF-8'
    }
  })
  return info
}

export async function getRewardsInfo(url, address, validator_addr) {
  var info = await fetch(url + "/distribution/delegators/" + address + "/rewards/" + validator_addr, {
    method: 'GET',
    headers: {
       'Content-Type' : 'application/x-www-form-urlencoded; charset=UTF-8'
    }
  })
  return info
}

export async function injectTx(url, tx) {
 var resp = fetch(url + '/txs', {
  method: 'POST',
  headers: {
     'Content-Type' : 'application/x-www-form-urlencoded; charset=UTF-8'
  },
  body: tx,
  json: true
})
return resp }
