import React from "react";
import { Document, Page, Text, View, StyleSheet, Image } from "@react-pdf/renderer";

const SubscriptionPDF = ({ data = [] }) => {
    console.log("data : ", data);

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                <View style={styles.header}>
                    <Text style={styles.title}>College Subscriptions Quotation</Text>
                    <Text style={styles.separator}>────────────────────────────────────</Text>
                </View>
                {Array.isArray(data) && data.length > 0 ? (
                    data.map((sub, index) => (
                        <View key={index} style={styles.subscriptionContainer}>
                            <View style={styles.subscriptionDetails}>
                                <Text style={styles.label}>College: <Text style={styles.value}>{sub.college?.[0]?.clgName || "N/A"}</Text></Text>
                                <Text style={styles.label}>Librarian: <Text style={styles.value}>{sub.college?.[0]?.librarianName || "N/A"}</Text></Text>
                                <Text style={styles.label}>Mobile: <Text style={styles.value}>{sub.college?.[0]?.librarianMobile || "N/A"}</Text></Text>
                                <Text style={styles.label}>Total Books: <Text style={styles.value}>{sub.totalBooks || "0"}</Text></Text>
                                <Text style={styles.label}>Total Amount (₹): <Text style={styles.value}>{sub.totalAmount || "0"}</Text></Text>
                                <Text style={styles.label}>Status: <Text style={styles.value}>{sub.status}</Text></Text>
                            </View>
                            <Text style={styles.separator}>────────────────────────────</Text>
                            <View style={styles.booksContainer}>
                                {sub.books?.map((book, bookIndex) => (
                                    <View key={bookIndex} style={styles.bookCard}>
                                        {book.coverImage && (
                                            <Image
                                                src={book.coverImage.replace("\\", "/")}
                                                style={styles.bookImage}
                                            />
                                        )}
                                        <Text style={styles.bookTitle}>{book.name}</Text>
                                        <Text style={styles.bookInfo}>Author: {book.author}</Text>
                                        <Text style={styles.bookInfo}>Category: {book.category}</Text>
                                        <Text style={styles.bookInfo}>Price: ₹{book.price}</Text>
                                        <Text style={styles.bookInfo}>Year Published: {book.yearPublished}</Text>
                                    </View>
                                ))}
                            </View>
                        </View>
                    ))
                ) : (
                    <Text>No Subscription Data Available</Text>
                )}
            </Page>
        </Document>
    );
};

const styles = StyleSheet.create({
    page: { padding: 20, backgroundColor: '#f5f5f5' },
    header: { marginBottom: 20, textAlign: 'center' },
    title: { fontSize: 24, fontWeight: 'bold', marginBottom: 10 },
    separator: { marginVertical: 10, fontSize: 12, color: "gray" },
    subscriptionContainer: { marginBottom: 20, padding: 10, border: '1px solid #ddd', borderRadius: 5 },
    subscriptionDetails: { marginBottom: 10 },
    label: { fontSize: 14, marginBottom: 4 },
    value: { fontWeight: 'bold' },
    booksContainer: { display: 'flex', flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
    bookCard: { width: '30%', padding: 5, border: '1px solid #ddd', borderRadius: 5, textAlign: 'center' },
    bookImage: { width: '100%', height: 80, objectFit: 'cover', marginBottom: 5 },
    bookTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 5 },
    bookInfo: { fontSize: 12, marginBottom: 2 }
});

export default SubscriptionPDF;
 


// import React from 'react'
// import { Document, Page, Image, Text, StyleSheet, View, Font } from '@react-pdf/renderer'
// import logo from '../images/ap-removebg-preview.png'
// import GoogleFont from "../images/GoogleRegular.ttf"



// Font.register({ family: "GoogleFont", src: GoogleFont })

// const formatDate = (dateString) => {
//     const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
//     return new Date(dateString).toLocaleDateString('en-GB', options);
// };


// const PrintProjectDetails = ({ data }) => {

//     const formattedDate = new Date().toLocaleDateString('en-GB');
//     const currentTime = new Date().toLocaleTimeString('en-GB');
//     const hours = new Date().getHours();
//     const ampm = hours >= 12 ? 'PM' : 'AM';
//     return (
//         <Document>
//             <Page size="A4" style={styles.page}>
//                 <View>
//                     <View style={styles.header}>
//                         <Image src={logo} style={styles.logo} />
//                         <Text style={styles.headerText}>A P Consultant & Engineers LLP</Text>
//                     </View>
//                     <View style={styles.addressBox}>
//                         <View>
//                             <Text style={styles.text}>Head Office: 2, Stadium Complex, below Lokmat Office,Opp.SBI Bank, Jalgaon 425001(MH)</Text>
//                             <Text style={styles.text}>Other Offices: Pune,Mumbai, Delhi, Bhuranpur</Text>
//                             <Text style={styles.text}>Website: www.apconsult.in</Text>
//                         </View>
//                         <View style={styles.secondAddressBox}>
//                             <Text style={styles.text}>Phone No: 8956159404</Text>
//                             <Text style={styles.text}>Email: apconsultant14@gmail.com</Text>
//                         </View>
//                     </View>
//                 </View>
//                 <View style={styles.content}>
//                     <Text style={{ fontSize: 11, fontFamily: "GoogleFont", textAlign: 'right', marginRight: 30 }}>Date: {formattedDate} {currentTime} {ampm}</Text>
//                     <View>
//                         <Text style={styles.contentName}>Hello, {data.customerId.name}.  [ {data.customerId.customerCode} ] </Text>
//                         <Text style={[styles.contentName, { paddingTop: 3 }]}>{data.serviceName}, {data.projectType}</Text>

//                         <View>
//                             <Text style={styles.contentParagraph}>&nbsp;&nbsp; &nbsp; &nbsp; &nbsp; &nbsp;I hope this letter find you in good health. we are delighted to inform you that the agreement for the   {data.serviceName}, {data.projectType} project  has been successfully confirmed</Text>
//                         </View>
//                     </View>
//                     <View>
//                         <Text style={styles.title}>Project Details</Text>
//                         <View style={styles.table}>
//                             <View>
//                                 <Text style={styles.tableTitle}>Project Cost</Text>
//                                 <Text style={styles.tableValue}>{Number(data.estimateCost).toLocaleString('en-IN')}</Text>
//                             </View>
//                             <View>
//                                 <Text style={styles.tableTitle}>Machinery Cost</Text>
//                                 <Text style={styles.tableValue}>{Number(data.machinaryCost).toLocaleString('en-IN')}</Text>
//                             </View>
//                             <View>
//                                 <Text style={styles.tableTitle}>Other Cost</Text>
//                                 <Text style={styles.tableValue}>{Number(data.otherCost).toLocaleString('en-IN')}</Text>
//                             </View>
//                             <View>
//                                 <Text style={styles.tableTitle}>Status</Text>
//                                 <Text style={styles.tableValue}>{data.projectStatus}</Text>
//                             </View>
//                         </View>
//                     </View>
//                     <View>
//                         <Text style={styles.title}>Customer Details</Text>
//                         <View style={styles.table}>
//                             <View>
//                                 <Text style={[styles.tableTitle, { width: "170px", borderRightWidth: 0, }]}>Name</Text>
//                                 <Text style={[styles.tableValue, { width: "170px", borderRightWidth: 0, }]}>{data.customerId.name}</Text>
//                             </View>
//                             <View>
//                                 <Text style={styles.tableTitle}>Mobile Number</Text>
//                                 <Text style={styles.tableValue}>{data.customerId.mobile}</Text>
//                             </View>
//                             <View>
//                                 <Text style={[styles.tableTitle, { width: "185px", borderLeftWidth: 0 }]}>Address</Text>
//                                 <Text style={[styles.tableValue, { width: "185px", borderLeftWidth: 0 }]}>{`${data.customerId.city}, ${data.customerId.district}, ${data.customerId.state} `}</Text>
//                             </View>
//                         </View>
//                     </View>
//                     <View>
//                         <Text style={styles.title}>Payment Details</Text>
//                         <View style={styles.table}>
//                             <View>
//                                 <Text style={[styles.tableTitle, { borderRightWidth: 0 }]}>1st Installment</Text>
//                                 <Text style={[styles.tableValue, { borderRightWidth: 0 }]}>{Number(data.customerId.paymentDetails.firstInstallment).toLocaleString("en-IN")}</Text>

//                             </View>
//                             <View>
//                                 <Text style={styles.tableTitle} >2ed Installment</Text>
//                                 <Text style={styles.tableValue}>{Number(data.customerId.paymentDetails.secondInstallment).toLocaleString("en-IN")}</Text>
//                             </View>
//                             <View>
//                                 <Text style={[styles.tableTitle, { borderLeftWidth: 0 }]} >Total Cost</Text>
//                                 <Text style={[styles.tableValue, { borderLeftWidth: 0 }]} >{Number(data.customerId.paymentDetails.totalCost).toLocaleString("en-IN")}</Text>
//                             </View>

//                         </View>
//                     </View>
//                     <View>
//                         <Text style={styles.title}>Project Status</Text>
//                         <View style={styles.tableMessage}>
//                             <View style={styles.tableRow}>
//                                 <View style={[styles.noView, styles.verticalLine]}>
//                                     <Text style={styles.tableT}>No.</Text>
//                                 </View>
//                                 <View style={[styles.statusView, styles.verticalLine]}>
//                                     <Text style={styles.tableT}>Project Status</Text>
//                                 </View>
//                                 <View style={[styles.messageView, styles.verticalLine]}>
//                                     <Text style={styles.tableT}>Messages</Text>
//                                 </View>
//                                 <View style={[styles.datetimeView, styles.verticalLine]}>
//                                     <Text style={styles.tableT}>Date / Time</Text>
//                                 </View>
//                             </View>
//                             {data.statusStages.map((item, index) => (
//                                 <View key={index} style={styles.tableRow}>
//                                     <View style={[styles.noView, styles.verticalLine]}>
//                                         <Text style={styles.tableT}>{index + 1}</Text>
//                                     </View>
//                                     <View style={[styles.statusView, styles.verticalLine]}>
//                                         <Text style={styles.tableT}>{item.stageStatus}</Text>
//                                     </View>

//                                     <View style={[styles.messageView, styles.verticalLine]}>
//                                         <Text style={styles.tableT}>{item.stageComment}</Text>
//                                     </View>
//                                     <View style={[styles.datetimeView, styles.verticalLine]}>
//                                         <Text style={styles.tableT}>{formatDate(item.InitiatedAt)}</Text>
//                                     </View>
//                                 </View>
//                             ))}
//                         </View>
//                     </View>
//                     <View>
//                         <Text style={styles.contentParagraph}>&nbsp;&nbsp; &nbsp; with the agreement now in place, we are committed to ensuring the suceessful execution of
//                             the {data.serviceName} {data.projectType} Project, We Kindly
//                             request you to provide the other details Should you have any questions or require futher clarification
//                             please do not hesitate to reach out to us</Text>
//                     </View>
//                     <View>
//                         <Text style={styles.contentParagraph}>&nbsp;&nbsp; &nbsp;Thank you for us for your  {data.projectType} project we look forword to suceessfull
//                             collaboration</Text>
//                     </View>
//                 </View>
//                 <View style={styles.signbox}>
//                     <Text style={styles.name}>Ajay Patil</Text>
//                     <Text style={styles.Subname}>CEO and founder of AP consultants & Engineers LLP </Text>
//                 </View>
//             </Page>
//         </Document >
//     )
// }

// export default PrintProjectDetails


// const styles = StyleSheet.create({
//     page: {
//         flex: 1,
//         margin: 10,
//     },
//     logo: {
//         width: 50,
//         height: 41,
//         marginRight: 10
//     },
//     header: {
//         justifyContent: 'center',
//         alignItems: 'center',
//         flexDirection: "row",
//     },
//     headerText: {
//         fontSize: 25,
//         fontWeight: 800,
//         fontFamily: "GoogleFont"
//     },
//     addressBox: {
//         flexDirection: 'row',
//         justifyContent: "space-between",
//         alignItems: 'center',
//         paddingVertical: 8,
//         borderBottomWidth: 1,
//         borderColor: "#101010",
//         marginRight: 20,

//     },
//     text: {
//         fontSize: 10,
//         fontFamily: "GoogleFont"
//     },
//     content: {
//         padding: 15
//     },
//     contentName: {
//         fontSize: 12,
//         fontFamily: 'GoogleFont'
//     },
//     contentParagraph: {
//         fontFamily: 'GoogleFont',
//         fontSize: 12,
//         paddingTop: 10,
//         marginRight: 20
//     },
//     title: {
//         fontFamily: 'GoogleFont',
//         fontSize: 12,
//         fontWeight: 800,
//         marginTop: 8,
//         marginBottom: 3
//     },
//     table: {
//         borderColor: 'gray',
//         flexDirection: 'row',
//         marginRight: 27
//     },
//     tableTitle: {
//         borderTopWidth: 0.6,
//         borderBottomWidth: 0.6,
//         borderLeftWidth: 0.6,
//         borderRightWidth: 0.6,
//         borderColor: 'gray',
//         width: "135px",
//         fontSize: 11,
//         paddingLeft: 8,
//         paddingVertical: 4,
//         textAlign: "center"
//     },
//     tableValue: {
//         borderLeftWidth: 0.6,
//         borderRightWidth: 0.6,
//         borderBottomWidth: 0.6,
//         borderColor: 'gray',
//         width: "135px",
//         fontSize: 11,
//         paddingLeft: 8,
//         paddingVertical: 4,
//         textAlign: "center"
//     },
//     arrowImage: {
//         width: 12,
//         height: 12,
//         marginHorizontal: 4,
//         marginBottom: 7
//     },
//     projectMessageBox: {
//         flexDirection: 'row',
//         flexWrap: 'wrap',
//         alignItems: 'center',
//         marginTop: 5
//     },
//     messageContainer: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         backgroundColor: 'lightgray',
//         padding: 5,
//         borderRadius: 5,
//         marginBottom: 5,
//     },
//     messagesText: {
//         fontSize: 11,
//         fontFamily: 'GoogleFont'
//     },
//     signbox: {
//         width: "200px",
//         paddingTop: 40,
//         justifyContent: 'center',
//         alignSelf: 'flex-end',
//         alignItems: 'center',
//         marginRight: 40
//     },
//     name: {
//         fontSize: 13,
//         fontFamily: 'GoogleFont',
//         fontWeight: 'bold',
//         paddingBottom: 5
//     },
//     Subname: {
//         fontSize: 12,
//         fontFamily: 'GoogleFont',
//         textAlign: 'center'
//     },
//     tableMessage: {
//         display: 'table',
//         width: '95%',
//         borderStyle: 'solid',
//         borderWidth: 0.6,
//         borderBottomWidth: 0,
//         borderRightWidth: 0,
//         borderColor: 'gray',
//     },
//     tableRow: {
//         flexDirection: 'row',
//         borderBottomWidth: 0.6,
//         borderBottomColor: 'gray',
//     },
//     noView: {
//         width: "8%",
//         padding: 5
//     },
//     statusView: {
//         width: "30%",
//         padding: 5

//     },
//     messageView: {
//         width: "32%",
//         padding: 5

//     },
//     datetimeView: {
//         width: "30%",
//         padding: 5

//     },
//     verticalLine: {
//         borderRightWidth: 0.6,
//         borderRightColor: 'gray',
//     },
//     tableT: {
//         fontSize: 11,
//         textAlign: 'center'
//     }

// })
