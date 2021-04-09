import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Navbar from "../../components/Navbar";
import TableDashboard from "../../components/TableDashboard";
import { audioActions } from "../../redux/actions";

// Dashboard (Main page with the table)

function Dashboard() {
  // const [sortBy, setSortBy] = useState("audioId");
  // const [order, setOrder] = useState("desc");
  // const [limit, setLimit] = useState(10);
  const dispatch = useDispatch();
  const audios = useSelector((state) => state.audio);

  useEffect(() => {
    if (audios) {
      dispatch(audioActions.audiosRequest());
    }
    // eslint-disable-next-line
  }, [dispatch]);
  return (
    <div>
      <Navbar />

      <TableDashboard />
    </div>
  );
}

export default Dashboard;
