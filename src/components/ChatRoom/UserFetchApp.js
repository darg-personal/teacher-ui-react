import { useState, useEffect, useCallback, useRef } from "react";

import UseFetch from "./UseFetch";

function UserFetchApp() {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const { loading, error, list } = UseFetch(query, page);
  const loader = useRef(null);

  // const handleChange = (e) => {
  //   console.log('e.target.value : ', e.target.value);
  //   setQuery(e.target.value);
  // };

  const handleObserver = useCallback((entries) => {
    console.log('entries', entries);
    const target = entries[0];
    if (target.isIntersecting) {
      setPage((prev) => prev + 1);
    }
  }, []);

  useEffect(() => {
    const option = {
      root: null,
      rootMargin: "20px",
      threshold: 0
    };
    const observer = new IntersectionObserver(handleObserver, option);
    if (loader.current) {
      console.log('handling event', loader.current)
      observer.observe(loader.current);
    }
  }, [handleObserver]);

  return (
    <div className="App">
      <h1>Infinite Scroll</h1>
      <h2>with IntersectionObserver</h2>
      <div>
        {list.map((item, i) => (
          <div  key={item.id}> {item.id},{item.message_text}, {item.created_at}</div>
        ))}
      </div>
      {loading && <p>Loading...</p>}
      {error && <p>Error!</p>}
      <div ref={loader} />
    </div>
  );
}

export default UserFetchApp;