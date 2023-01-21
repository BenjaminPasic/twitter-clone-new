import { useParams } from "react-router-dom";
import "../css/SearchResult.css";
import { getUsersBySearchParam } from "../api/userApi";
import { useQuery } from "react-query";
import UserSearchResult from "./UserSearchResult";
import CircularProgress from "@mui/material/CircularProgress";

const SearchResult = () => {
  const { search: searchInput } = useParams();
  const { isFetching, data } = useQuery(`search-${searchInput}`, () =>
    getUsersBySearchParam(searchInput)
  );

  if (isFetching) {
    return (
      <div className="fullScreen">
        <CircularProgress />
      </div>
    );
  }

  return (
    <div className="search-result">
      <h2>Results for: {searchInput}</h2>
      <div className="container">
        <div className="user-results">
          {data?.data.length === 0 ? (
            <h2 style={{ background: "#121212" }}>No results found</h2>
          ) : (
            data?.data.map((user) => {
              return <UserSearchResult user={user} key={user.username} />;
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchResult;
