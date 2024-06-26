const express = require('express');
const path = require('path');
const app = express();
const mongoose = require('mongoose');
const appointments = require('./Models/appointments.js');
const dotenv = require('dotenv');
app.use(express.json());
dotenv.config();

const uri = process.env.mongodb_uri;
mongoose.connect(uri);

const database = mongoose.connection;
database.on("error", (error) => {
    console.log(error);
});
database.once("connected", () => {
    console.log("Database Connected");
});

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/patient', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'appointment.html'));
});

app.get('/thank-you', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'submitted.html'));
});

app.get('/patient/:id', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'viewappointments.html'));
});
app.get('/update/:id', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'update.html'));
})
app.get('/appointments/:id', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'update.html'));
})
app.get('/appointments/doctor/:doctorName', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'doctorname.html'));
})

app.post('/submit', async (req, res) => {
    try {
        const data = req.body;
        const result = await appointments.create(data);
        console.log(result);
        res.status(201).redirect('/thank-you');
    } catch (error) {
        console.log(error);
        res.status(500).json();
    }
});

app.get('/api/patient/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const details = await appointments.findOne({ patientId: id });
        if (details) {
            res.json(details);
        } else {
            res.status(404).json({ message: 'Appointment not found' });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
});


app.put('/api/patient/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const updatedData = req.body;
        const options = { new: true };

        const updatedDetails = await appointments.findOneAndUpdate({ patientId: id }, updatedData, options);

        if (updatedDetails) {
            res.status(200).json(updatedDetails);
        } else {
            res.status(404).json({ message: 'Appointment not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


app.delete('/api/patient/:id', async (req, res) => {
    try {
        const id = req.params.id;

        const deletedDetails = await appointments.findOneAndDelete({ patientId: id });

        if (deletedDetails) {
            res.status(200).json({ message: 'Appointment Details deleted successfully' });
        } else {
            res.status(404).json({ message: 'Appointment Details not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// app.get('/api/appointments/doctor/:doctorName', async (req, res) => {
//     try {
//         const doctorName = req.params.doctorName;
//         const appointmentsList = await appointments.find({ doctorName: doctorName });

//         if (appointmentsList.length > 0) {
//             res.status(200).json(appointmentsList);
//         } else {
//             res.status(404).json({ message: 'No appointments found for this doctor' });
//         }
//     } catch (error) {
//         console.log(error);
//         res.status(500).json({ message: error.message });
//     }
// });
app.get('/api/appointments/doctor/:doctorName', async (req, res) => {
    try {
        const doctorName = req.params.doctorName;
        const appointmentsList = await appointments.find({ doctorName: { $regex: new RegExp(doctorName, "i") } });

        if (appointmentsList.length > 0) {
            res.status(200).json(appointmentsList);
        } else {
            res.status(404).json({ message: 'No appointments found for this doctor' });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
});



const PORT = 3002;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
