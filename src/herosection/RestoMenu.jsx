import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useGlobalApiHandler } from "../utils/useGlobalApiHandler";
import { BASE_URL } from "../utils/constant";
import Divider from "../components/Divider";
import MenuView from "../components/MenuView";
import MenuShimmer from "../components/shimmers/MenuShimmer";

function RestoMenu() {
  const restaurantId = useSelector((state) => state.activeData.restaurantId);

  const apiHandler = useGlobalApiHandler();

  const [headingData, setHeadingData] = useState({
    name: "",
    location: "",
    area: "",
    charges: "",
  });
  const [menuData, setMenuData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const getMenu = async () => {
    setIsLoading(true);
    const apiData = {
      method: "get",
      url:
        BASE_URL +
        "menu/pl?page-type=REGULAR_MENU&complete-menu=true&lat=19.0330488&lng=73.0296625&restaurantId=" +
        restaurantId +
        "&catalog_qa=undefined&submitAction=ENTER",
    };
    const response = await apiHandler(apiData);
    if (response?.data) {
      setHeadingData((prev) => ({
        ...prev,
        charges:
          response?.data?.cards[2]?.card?.card?.info?.feeDetails?.message,
        location: response?.data?.cards[2]?.card?.card?.info?.locality,
        area: response?.data?.cards[2]?.card?.card?.info?.areaName,
        name: response?.data?.cards[2]?.card?.card?.info?.name,
      }));

      const filteredData =
        response?.data?.cards[4]?.groupedCard?.cardGroupMap?.REGULAR?.cards?.filter(
          (menu) => {
            return menu?.card?.card?.itemCards;
          }
        );
      setMenuData(filteredData);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getMenu();
  }, []);

  return (
    <>
      {isLoading ? (
        <MenuShimmer />
      ) : (
        <div>
          <div className="p-4">
            <div className="font-bold text-primary text-center text-4xl mb-2">
              {headingData.name}
            </div>
            <p className="text-center text-primary text-[12px]">
              {headingData.location}, {headingData.area}
            </p>
            {headingData.charges && (
              <p className="text-center text-secondary text-[13px] italic">
                {headingData.charges}
              </p>
            )}
            <Divider />
            <MenuView data={menuData} />
          </div>
        </div>
      )}
    </>
  );
}

export default RestoMenu;
