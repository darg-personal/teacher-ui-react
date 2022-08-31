import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import utils from "../../pages/auth/utils";

let Token = localStorage.getItem("token");

function UseFetch(query, page) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [list, setList] = useState([]);

  const sendQuery = useCallback(async () => {
    try {
      await setLoading(true);
      await setError(false);
      console.log(page, '***************');
      const res = await axios.get(`${utils.getHost()}/chat/get/channel/paginated_messages/?channel=1&records=10&p=${page}`,
      // const res = await axios.get(`${utils.getHost()}/chat/get/user_connected_list/`,
        {
          headers: {
            Authorization:
              `Bearer ${Token}`,
          }
        }
        )
      console.log('===================== data ===================');
      const groups = res.data;
      console.log(groups);
      await console.log(groups.results, "-------response.data-");
      await setList((prev) => [...prev, ...res.data['results']]);
      setLoading(false);
    } catch (err) {
      console.log(" ***** ERROR ************ ");
      console.log(err);
      setError(err);
    }
  }, [query, page]);

  useEffect(() => {
    sendQuery(query);
  }, [query, sendQuery, page]);

  return { loading, error, list };
}

export default UseFetch;