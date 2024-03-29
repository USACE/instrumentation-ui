/* eslint-disable no-unused-vars, no-console */

import React, { useEffect, useState } from 'react';
import { connect } from 'redux-bundler-react';
// import {
//   PDFDownloadLink,
//   Document,
//   Page,
//   View,
//   Text,
//   Image,
//   StyleSheet,
//   Font,
// } from '@react-pdf/renderer';

import Button from '../../../../app-components/button';
import Plotly from '../../../../app-components/chart/minify-plotly';
import latoBoldSource from '../../../../css/google-fonts/fonts/Lato-Bold.ttf';
import latoSource from '../../../../css/google-fonts/fonts/Lato-Regular.ttf';

// Font.register({ family: 'Lato', src: latoSource });
// Font.register({ family: 'Lato-Bold', src: latoBoldSource });

// const styles = StyleSheet.create({
//   page: {
//     flexDirection: 'column',
//     backgroundColor: '#fff',
//     width: '100%',
//   },
//   section: {
//     padding: 10,
//     flexDirection: 'row',
//     borderBottom: '2px solid black',
//   },
//   logo: {
//     height: 50,
//     width: 74,
//   },
//   text: {
//     paddingTop: 7,
//     fontFamily: 'Lato-Bold',
//     fontSize: 24,
//   },
//   header: {
//     padding: 10,
//     fontSize: 16,
//     fontFamily: 'Lato',
//   },
//   subheader: {
//     padding: 10,
//     fontSize: 12,
//     fontFamily: 'Lato',
//   },
// });

const PrintButton = connect(
  'selectBatchPlotConfigurationsActiveId',
  'selectBatchPlotConfigurationsItems',
  'selectProjectsByRoute',
  'selectPrintData',
  'selectPrintLayout',
  ({
    batchPlotConfigurationsActiveId: activeId,
    batchPlotConfigurationsItems: items,
    projectsByRoute,
    printData,
    printLayout,
  }) => {
    // const [plotConfigName, setPlotConfig] = useState('');
    // const [imgSrc, setSrc] = useState('');
    // const [name, setName] = useState('');
    // const logo = 'https://media.defense.gov/2013/Oct/03/2000759570/-1/-1/0/131003-A-CL603-001.PNG';

    // const MyDoc = () => (<></>
    //   // <Document>
    //   //   <Page style={styles.page} orientation='landscape'>
    //   //     <View style={styles.section}>
    //   //       <Image style={styles.logo} src={logo}></Image>
    //   //       <Text style={styles.text}>USACE-MIDAS</Text>
    //   //     </View>
    //   //     <View>
    //   //       <Text style={styles.header}>Project: {name}</Text>
    //   //       <Text style={styles.subheader}>
    //   //         Configuration: {plotConfigName}
    //   //       </Text>
    //   //       <Image src={imgSrc}></Image>
    //   //     </View>
    //   //   </Page>
    //   // </Document>
    // );

    // useEffect(() => {
    //   if (projectsByRoute) {
    //     const { name } = projectsByRoute;
    //     setName(name);
    //   }
    //   if (activeId) {
    //     const activePlotName = items.find((x) => x.id === activeId).name;
    //     setPlotConfig(activePlotName);
    //   }
    //   const fetchSrc = async () => {
    //     const response = await Plotly.toImage(
    //       {
    //         data: printData,
    //         layout: printLayout,
    //       },
    //       {
    //         height: 400,
    //         width: 1200,
    //       }
    //     );
    //     setSrc(response);
    //   };
    //   fetchSrc();
    // }, [printData, projectsByRoute, activeId]);
    console.log('');

    return (
      // <PDFDownloadLink
      //   document={<MyDoc />}
      //   fileName={`${name}-${plotConfigName}.pdf`}
      // >
      //   {({ blob, url, loading, error }) => (
      //     <Button variant='info' size='small' isOutline text='Download' />
      //   )}
      // </PDFDownloadLink>
      <></>
    );
  }
);

export default PrintButton;
