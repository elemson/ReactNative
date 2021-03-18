
require("../lib/swisscalc.lib.format.js");
require("../lib/swisscalc.lib.operator.js");
require("../lib/swisscalc.lib.operatorCache.js");
require("../lib/swisscalc.lib.shuntingYard.js");
require("../lib/swisscalc.display.numericDisplay.js");
require("../lib/swisscalc.display.memoryDisplay.js");
require("../lib/swisscalc.calc.calculator.js");

import React from 'react';
import * as SQLite from 'expo-sqlite';
import * as firebase from 'firebase'
import { StyleSheet, Dimensions, PanResponder, View, Text } from 'react-native';
import {AddHistory} from  './Firestore/Firestore'
import { CalcDisplay, CalcButton } from './../components';
import {firebaseConfig} from './Config/Firebase.config.js'

export default class CalculatorScreen extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      display: "0",
      orientation: "portrait",    // "portrait" or "landscape"
	  history: []
    }
    // Initialize calculator...
    this.oc = global.swisscalc.lib.operatorCache;
    this.calc = new global.swisscalc.calc.calculator();


	//Firebase
	firebase.initializeApp(firebaseConfig);
	// AddHistory(this.state.history)

	// Sqlite db
	// const db =SQLite.openDatabase('history.db')
	// this.success, //okcallback
	// this.fail // error callback


    //   db.transaction(tx => {
    //     tx.executeSql('SELECT * FROM history', [], (tx, results) => {
    //       let history = [];
    //       for (let i = 0; i < results.rows.length; i++) {
    //         history.push(results.rows.item(i));
    //       }

    //        this.setState({ history });
    //     });
    //   });

    // Listen for orientation changes...
    Dimensions.addEventListener('change', () => {
      const { width, height } = Dimensions.get("window");
      var orientation = (width > height) ? "landscape" : "portrait";
      this.setState({ orientation: orientation });
    });

    // Setup gestures...
    this.panResponder = PanResponder.create({
      onStartShouldSetPanResponder: (evt, gestureState) => true,
      onStartShouldSetPanResponderCapture: (evt, gestureState) => true,
      onMoveShouldSetPanResponder: (evt, gestureState) => true,
      onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,
      onPanResponderMove: (evt, gestureState) => { },
      onPanResponderRelease: (evt, gestureState) => {
        if (Math.abs(gestureState.dx) >= 50) {
          this.onBackspacePress();
        }
      },
    })
  }

  onDigitPress = (digit) => {
    this.calc.addDigit(digit);
	let recentHistory = this.state.history.concat(digit)
    this.setState({ display: this.calc.getMainDisplay(), history: recentHistory });
  }

  onUnaryOperatorPress = (operator) => {
    this.calc.addUnaryOperator(operator);
   let recentHistory = this.state.history.concat(this.calc.getMainDisplay())
    this.setState({ display: this.calc.getMainDisplay(), history: recentHistory });
  }

  onBinaryOperatorPress = (operator, operatorSign) => {
    this.calc.addBinaryOperator(operator);
    let recentHistory = this.state.history.concat(operatorSign)
    this.setState({ display: this.calc.getMainDisplay(), history: recentHistory });
  }

  onEqualsPress = (operator) => {
    this.calc.equalsPressed();
    let recentHistory = this.state.history.concat(operator, this.calc.getMainDisplay()).toString().replace(/,/g,"");
	this.setState({ display: recentHistory, history: recentHistory })

	setTimeout(() => {
		localStorage.setItem("Calc", this.state.history)
		console.log(this.state.history)
 	}, 3000);
  }

  onClearPress = () => {
    this.calc.clear();
    this.setState({ display: this.calc.getMainDisplay(), history: [] });
  }

  onPlusMinusPress = (operator) => {
    this.calc.negate();
    let recentHistory = this.state.history.concat(operator)
    this.setState({ display: this.calc.getMainDisplay(), history: recentHistory });
  }

  onBackspacePress = () => {
    this.calc.backspace();
    let recentHistory = this.state.history.concat(this.calc.getMainDisplay())
    this.setState({ display: this.calc.getMainDisplay(), history: recentHistory });
  }

  renderPortrait() {
    return (
      <View style={styles.container}>
        <View style={{flex:1, justifyContent: "flex-end"}} {...this.panResponder.panHandlers}>
          <CalcDisplay display={this.state.display} />
        </View>

        <View>
          <View style={{flexDirection: "row", justifyContent: "space-between",}}>
            <CalcButton onPress={this.onClearPress} title="AC" color="white" backgroundColor="#DCC894" />
            <CalcButton onPress={this.onPlusMinusPress} title="+/-" color="white" backgroundColor="#DCC894" />
            <CalcButton onPress={() => { this.onUnaryOperatorPress(this.oc.PercentOperator) }} title="%" color="white" backgroundColor="#DCC894" />
            <CalcButton onPress={() => { this.onBinaryOperatorPress(this.oc.DivisionOperator, '/'); }} title="/" color="white" backgroundColor="#DCA394" />
          </View>

          <View style={{flexDirection: "row", justifyContent: "space-between",}}>
            <CalcButton onPress={() => { this.onDigitPress("7") }} title="7" color="white" backgroundColor="#607D8B" />
            <CalcButton onPress={() => { this.onDigitPress("8") }} title="8" color="white" backgroundColor="#607D8B" />
            <CalcButton onPress={() => { this.onDigitPress("9") }} title="9" color="white" backgroundColor="#607D8B" />
            <CalcButton onPress={() => { this.onBinaryOperatorPress(this.oc.MultiplicationOperator, "x") }} title="x" color="white" backgroundColor="#DCA394" />
          </View>

          <View style={{flexDirection: "row", justifyContent: "space-between",}}>
            <CalcButton onPress={() => { this.onDigitPress("4") }} title="4" color="white" backgroundColor="#607D8B" />
            <CalcButton onPress={() => { this.onDigitPress("5") }} title="5" color="white" backgroundColor="#607D8B" />
            <CalcButton onPress={() => { this.onDigitPress("6") }} title="6" color="white" backgroundColor="#607D8B" />
            <CalcButton onPress={() => { this.onBinaryOperatorPress(this.oc.SubtractionOperator, "-") }} title="-" color="white" backgroundColor="#DCA394" />
          </View>

          <View style={{flexDirection: "row", justifyContent: "space-between",}}>
            <CalcButton onPress={() => { this.onDigitPress("1") }} title="1" color="white" backgroundColor="#607D8B" />
            <CalcButton onPress={() => { this.onDigitPress("2") }} title="2" color="white" backgroundColor="#607D8B" />
            <CalcButton onPress={() => { this.onDigitPress("3") }} title="3" color="white" backgroundColor="#607D8B" />
            <CalcButton onPress={() => { this.onBinaryOperatorPress(this.oc.AdditionOperator, "+") }} title="+" color="white" backgroundColor="#DCA394" />
          </View>

		  <View style={{flexDirection: "row", justifyContent: "space-between",}}>
            <CalcButton onPress={() => { this.onDigitPress("0") }} title="0" color="white" backgroundColor="#607D8B" style={{flex:2}} />
            <CalcButton onPress={() => { this.onDigitPress(".") }} title="." color="white" backgroundColor="#607D8B" />
            <CalcButton onPress={() => {this.onEqualsPress('=')}} title="=" color="white" backgroundColor="#DCA394" />
          </View>

          <View style={{flexDirection: "row", justifyContent: "space-between",}}>
            <CalcButton onPress={() => { this.onDigitPress(".") }} title="KM to Mile" color="white" backgroundColor="#607D8B"  style={{flex:1}} />
          </View>

        </View>

      </View>
    );
  }

  renderLandscape() {
    return (
      <View>
        <Text>Landscape</Text>
      </View>
    )
  }

  render() {
    var view = (this.state.orientation == "portrait")
      ? this.renderPortrait()
      : this.renderLandscape();

    return (
      <View style={{flex:1}}>
        {view}
      </View>
    )
  }

}

const styles = StyleSheet.create({
  container: { flex: 1, paddingVertical: 50, backgroundColor: "black" },
})