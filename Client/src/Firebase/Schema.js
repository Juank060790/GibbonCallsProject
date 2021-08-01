// RawData schema
// {
// audioId: String,
// audioLink: String, // link to audio file
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
//     spectogramAudio: String, (to be confirmed) // audio file of spectogram
//     spectogram: String, // spectogram of audio file
//     color: String, ("rgba(252,110,191,0.1") // color of spectogram
//     comment: String, // comment of audio file
//     start: Number, // start time of audio file
//     end: Number, // end time of audio file
//     isCorrect: Boolean, // is correct
//     isDeleted: Boolean, // is deleted
//     label: String, // labels of audio file
// }
