const Show = require("../Schemas/Show");
const Booking = require("../Schemas/Booking");

exports.createBooking = async (req, res) => {
  try {
    const { showId, seats, amount } = req.body;

    const show = await Show.findById(showId);
    if (!show)
      return res.status(404).json({ ok: false, msg: "Show not found" });

    // Check seat availability
    const conflict = seats.some((seat) => show.bookedSeats.includes(seat));
    if (conflict) {
      return res.json({ ok: false, msg: "Some seats already booked" });
    }

    // Save booking
    const booking = await Booking.create({
      showId,
      movie: show.movie,
      seats,
      amount,
      theatre: show.theatreId,
      screen: show.screenId,
      date: show.date,
      time: show.time,
    });

    // Update booked seats
    await Show.findByIdAndUpdate(showId, {
      $push: {
        bookedSeats: {
          $each: seats.map((seat) => ({
            seatNumber: seat,
            bookedAt: new Date(),
          })),
        },
      },
    });

    res.json({ ok: true, booking });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, msg: "Booking failed" });
  }
};
