import axios from "axios";
import React, { useEffect, useState } from "react";

const Filter = () => {
  const [product, setProduct] = useState([]);
  const [isloading, setisloading] = useState(false);
  const [category, setcategory] = useState([]);
  const [filterProduct, setFilterProduct] = useState([]);
  const [search, setSearch] = useState("");
  const [found, setFound] = useState(false);

  // Get Data from the API
  const getData = async () => {
    setisloading(true);
    try {
      const data = await axios.get("https://fakestoreapi.com/products");
      const res = data?.data;
      setProduct(res);
      setisloading(false);
      const categories = [...new Set(res.map((item) => item.category))];
      setcategory(categories);
      setFilterProduct(res);
    } catch (error) {
      console.log(error);
      setisloading(false);
    }
  };

  //Handle Category Filtering
  const handleChange = (cat) => {
    if (cat === "All") {
      setFilterProduct(product);
    } else {
      const filterData = product.filter((item) => item.category === cat);
      setFilterProduct(filterData);
    }
  };

  //Handle Search Filtering
  // const handleSearch = () => {
  //   const searchFilter = filterProduct.filter((item) =>
  //     item.title.toLowerCase().includes(search.toLowerCase())
  //   );
  //   if (searchFilter.length === 0) {
  //     setFound(true);
  //   } else {
  //     setFilterProduct(searchFilter);
  //     setFound(false);
  //   }
  // };

  
  //Handle Filter Product By Search
  const handleSearch = () => {
    if (search.trim() === "") {
      // If search is empty, reset the filtered products to the full product list
      setFilterProduct(product);
      setFound(false); 
    } else {
      const searchFilter = product.filter((item) =>
        item.title.toLowerCase().includes(search.toLowerCase())
      );
      if (searchFilter.length === 0) {
        setFound(true);
      } else {
        setFilterProduct(searchFilter); 
        setFound(false);
      }
    }
  };
  

  //Handle Enter Search
  const handleEnterSearch = (e) => {
    if (e.key == "Enter") {
      handleSearch();
    }
  };

  // Manage Effect Events
  useEffect(() => {
    getData();
  }, []);

  return (
    <div>
      {isloading ? (
        <p>Loading...</p>
      ) : (
        <>
          <div>
            <input
              value={search}
              onKeyDown={handleEnterSearch}
              onChange={(e) => {
                setSearch(e.target.value);
                handleSearch()
                
              }}
            />
            <select
              onChange={(e) => {
                handleChange(e.target.value);
              }}
            >
              <option value="All">All</option>
              {category.map((item, i) => (
                <option key={i} value={item}>
                  {item}
                </option>
              ))}
            </select>
            <button onClick={handleSearch}>Search</button>
          </div>

          {found ? (
            <p>No Data Found</p>
          ) : (
            <>
              {filterProduct.map((item, i) => {
                const { image, title } = item;
                return (
                  <div key={i}>
                    <img src={image} />
                    <h4>{title}</h4>
                  </div>
                );
              })}
            </>
          )}
        </>
      )}
    </div>
  );
};

export default Filter;
