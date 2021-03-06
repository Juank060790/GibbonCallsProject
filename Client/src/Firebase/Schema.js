// RawData schema
// {
// audioId: String,
// audioName: String, // link to audio file
// comments: String, // comments
// correctCalls: Number, // number of correct calls
// duration: String, // duration of audio file
// gibbonCallsList: [{callId,}}, // list of calls
// isDeleted: Boolean, // is deleted
// recordDate: Date, // Firestore date format of recording
// }

// Single Calls
// {
//     callId: String, // unique id of call
//     createdBy: String, // Created by ML or Human
//     spectrogramImage: String, // spectrogram of audio file
//     color: String, ("rgba(252,110,191,0.1") // color of spectrogram
//     comment: String, // comment of audio file
//     start: Number, // start time of audio file
//     end: Number, // end time of audio file
//     isCorrect: Boolean, // is correct
//     isDeleted: Boolean, // is deleted
//     label: String, // labels of audio file
//     accuracy: String // accuracy of the call (0-100%)
// }
