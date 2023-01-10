import { useParams } from "react-router-dom";
import "../css/SearchResult.css";
import { getUsersBySearchParam } from "../api/userApi";
import { useQuery } from "react-query";
import UserSearchResult from "./UserSearchResult";

const SearchResult = () => {
  const { search: searchInput } = useParams();
  const { isFetching, data } = useQuery(`search-${searchInput}`, () =>
    getUsersBySearchParam(searchInput)
  );

  return (
    <div className="search-result">
      <h2>Results for: {searchInput}</h2>
      <div className="container">
        <div className="user-results">
          {data?.data.map((user) => {
            return <UserSearchResult user={user} key={user.username} />;
          })}
        </div>
      </div>
    </div>
  );
};

export default SearchResult;
