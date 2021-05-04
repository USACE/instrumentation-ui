import React, { useEffect, useState } from 'react';
import { connect } from 'redux-bundler-react';

import {
  PDFDownloadLink,
  Document,
  Page,
  View,
  Text,
  Image,
  StyleSheet,
  Font,
} from '@react-pdf/renderer';
import Plotly from 'plotly.js';
import Button from '../../../app-components/button';

import latoBoldSource from '../../../css/google-fonts/fonts/Lato-Bold.ttf';
import latoSource from '../../../css/google-fonts/fonts/Lato-Regular.ttf';

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#fff',
    width: '100%',
  },
  section: {
    padding: 10,
    flexDirection: 'row',
    borderBottom: '2px solid black',
  },
  logo: {
    height: 50,
    width: 74,
  },
  // image: {
  //   height: 350,
  //   width: 750,
  // },
  text: {
    paddingTop: 7,
    fontFamily: 'Lato-Bold',
    fontSize: 24,
  },
  header: {
    padding: 10,
    fontSize: 16,
    fontFamily: 'Lato',
  },
});
Font.register({ family: 'Lato', src: latoSource });
Font.register({ family: 'Lato-Bold', src: latoBoldSource });

const Print = connect(
  'selectProjectsByRoute',
  'selectPrintData',
  'selectPrintLayout',
  ({ projectsByRoute, printData, printLayout }) => {
    const [imgSrc, setSrc] = useState('');
    const [name, setName] = useState('');
    const logo =
      'https://media.defense.gov/2013/Oct/03/2000759570/-1/-1/0/131003-A-CL603-001.PNG';
    const MyDoc = () => (
      <Document>
        <Page style={styles.page} orientation='landscape'>
          <View style={styles.section}>
            <Image style={styles.logo} src={logo}></Image>
            <Text style={styles.text}>USACE-MIDAS</Text>
          </View>
          <View>
            <Text style={styles.header}>Project: {name}</Text>
            <Image src={imgSrc}></Image>
          </View>
        </Page>
      </Document>
    );
    useEffect(() => {
      console.log(projectsByRoute);
      // const { name } = projectsByRoute;
      // if (name && projectsByRoute) {
      //   setName(name);
      // }
      if (projectsByRoute) {
        const { name } = projectsByRoute;
        setName(name);
      }
      const fetchSrc = async () => {
        const response = await Plotly.toImage(
          {
            data: printData,
            layout: printLayout,
          },
          {
            height: 400,
            width: 1200,
          }
        );
        setSrc(response);
      };
      fetchSrc();
    }, [printData, projectsByRoute]);
    return (
      <PDFDownloadLink document={<MyDoc />} fileName='export.pdf'>
        {({ blob, url, loading, error }) => (
          <Button variant='info' size='small' isOutline text='Download' />
        )}
      </PDFDownloadLink>
    );
  }
);

export default Print;
