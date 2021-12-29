import React, { useEffect, useState, useContext } from "react";
import { DataGrid } from "@mui/x-data-grid";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import style from './ShowSummary.module.css'

// import Axios from "axios";
import axios from '../../axios'
import CircularProgress from "@mui/material/CircularProgress";
import { UserContext, useAuthContext, useAppContext } from "../../Context";

import { useLocation, useParams, useNavigate } from "react-router-dom";
import { bottomNavigationActionClasses } from "@mui/material";

export default function ShowSummary() {
  const { isLoggedIn } = useAuthContext();
  const { createNotification } = useAppContext();

  const navigate = useNavigate();

  const [totalPrice, setTotalPrice] = useState(0);

  const { searchCriteria, chosenDepartureFlight, chosenReturnFlight,
    chosenSeatsDeparture, chosenSeatsReturn
  } = useContext(UserContext)


  useEffect(() => {

    if (searchCriteria == null)
      return navigate('/home')

    var cabin = searchCriteria.cabinClass;
    var children = searchCriteria.children;
    var adults = searchCriteria.adults;

    if (cabin == "economy") {
      var departurePrice =
        adults * chosenDepartureFlight.economyPrice +
        0.5 * (children * chosenDepartureFlight.economyPrice);
    } else {
      var departurePrice =
        adults * chosenDepartureFlight.businessPrice +
        0.5 * (children * chosenDepartureFlight.businessPrice);
    }
    if (cabin == "economy") {
      var returnPrice =
        adults * chosenReturnFlight.economyPrice +
        0.5 * (children * chosenReturnFlight.economyPrice);
    } else {
      var returnPrice =
        adults * chosenReturnFlight.businessPrice +
        0.5 * (children * chosenReturnFlight.businessPrice);
    }

    setTotalPrice(departurePrice + returnPrice);
  }, []);

  return chosenDepartureFlight == null ? (
    <CircularProgress />
  ) : (
    <div className={`${style.backgroundimg}`}>
      <div className="back">
      <h4 style={{color:"white",}} className="my-3" >Departure Flight</h4> 
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell allign="left">Departure Date</TableCell>
                <TableCell allign="left">Departure Airport</TableCell>
                <TableCell allign="left">Arrival Date</TableCell>
                <TableCell allign="left">Arrival Airport</TableCell>
                <TableCell allign="left">Departure Cabin</TableCell>
                <TableCell allign="left">Seat No.</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell align="left">{chosenDepartureFlight.departureDate}</TableCell>
                <TableCell align="left">{chosenDepartureFlight.departureAirport}</TableCell>
                <TableCell align="left">{chosenDepartureFlight.arrivalDate}</TableCell>
                <TableCell align="left">{chosenDepartureFlight.arrivalAirport}</TableCell>
                <TableCell align="left">
                  {searchCriteria.cabinClass}
                </TableCell>
                <TableCell align="left">
                  {chosenSeatsDeparture.map((seatNumber) => (<li>{seatNumber}</li>))}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
        <h4 style={{color:"white",}} className="my-4">Return Flight</h4> 
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell allign="left">Departure Date</TableCell>
                <TableCell allign="left">Departure Airport</TableCell>
                <TableCell allign="left">Arrival Date</TableCell>
                <TableCell allign="left">Arrival Airport</TableCell>
                <TableCell allign="left">Departure Cabin</TableCell>
                <TableCell allign="left">Seat No.</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell align="left">{chosenReturnFlight.departureDate}</TableCell>
                <TableCell align="left">
                  {chosenReturnFlight.departureAirport}
                </TableCell>
                <TableCell align="left">{chosenReturnFlight.arrivalDate}</TableCell>
                <TableCell align="left">{chosenReturnFlight.arrivalAirport}</TableCell>
                <TableCell align="left">
                  {searchCriteria.cabinClass}
                </TableCell>
                <TableCell align="left">
                  {chosenSeatsReturn.map((seatNumber) => (<li>{seatNumber}</li>))}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
        <h5 style={{color:'white', fontWeight:"bold"}}>price:{totalPrice}</h5>


        <br />
        <br />

        <Button
          variant="contained"
          onClick={async () => {
            console.log(searchCriteria);
            var reservation = {
              'departureFlightId': chosenDepartureFlight._id,
              'returnFlightId': chosenReturnFlight._id,
              'chosenCabinDeparture': searchCriteria.cabinClass,
              'chosenCabinReturn': searchCriteria.cabinClass,
              'seatNumbersDeparture': chosenSeatsDeparture,
              'seatNumbersReturn': chosenSeatsReturn,
              'adults': searchCriteria.adults,
              'children': searchCriteria.children
            }

            try {

              if (!isLoggedIn) {
                return createNotification('You need to login to be able to reserve', 'warning')
              }

              var req = await axios.post('/user/checkout', {
                amount: totalPrice
              });

              localStorage.setItem('reservation', JSON.stringify(reservation));

              console.log(req.data);
              window.location.href = req.data.url


              // await axios.post('http://localhost:8000/user/reservation/create', reservation);
              // navigate('/user/reservations');
            }
            catch (e) {
              alert(e.response.data);
            }
          }}
        >
          Reserve
        </Button>
      </div>
    </div>
  );
}
