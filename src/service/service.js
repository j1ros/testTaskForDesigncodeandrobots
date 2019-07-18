import axios from "axios";
import User from "./user"

const LIMITED_URL = "https://api.github.com/rate_limit";
const USERS_URL = "https://api.github.com/users";

function checkLimited() {
    return axios.get(LIMITED_URL).then(({ data }) => {
        return data.resources.core
    });
}

function getMs(data){
    const ms = data * 1000 - new Date().getTime() + 10000;
    return ms > 0 ? ms : 1000;
}

async function getAllUsers(data){
    let i = data.remaining
    let j = data.reset
    let loaded = 0;

    while(true){
        if(i<1){
            await new Promise(res => setTimeout(res, getMs(j)));
             let new_data = await checkLimited();
             i = new_data.remaining;
             j = new_data.reset;
            continue;
        }
        let res;

        try {
            i -= 1;
    
            res = await axios
              .get(USERS_URL, {
                params: { since: loaded}
              })
              .then(({ data }) => data);
          } catch (err) {
            continue;
          }
          
          const bulk = User.collection.initializeOrderedBulkOp();

          res.forEach(data => {
            bulk
              .find({
                ghid: data.id
              })
              .upsert()
              .updateOne({
                login: data.login,
                ghid: data.id
              });
          });
    
          await bulk.execute();
    
          loaded += res.length;
    }
}

module.exports = { checkLimited: checkLimited, getAllUsers: getAllUsers}