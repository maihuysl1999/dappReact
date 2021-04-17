import React, { useState,forwardRef, useRef, useImperativeHandle } from 'react'
import { Wheel } from 'react-custom-roulette'

const data = [
    { option: '0', style: { backgroundColor: 'green', textColor: 'black' } },
    { option: '32', style: { backgroundColor: 'red',textColor: 'white' } },
    { option: '15' , style: { backgroundColor: 'black',textColor: 'white' } },
    { option: '19', style: { backgroundColor: 'red',textColor: 'white' }  },
    { option: '4' , style: { backgroundColor: 'black',textColor: 'white' } },
    { option: '21' , style: { backgroundColor: 'red',textColor: 'white' } },
    { option: '2' , style: { backgroundColor: 'black',textColor: 'white' } },
    { option: '25' , style: { backgroundColor: 'red',textColor: 'white' } },
    { option: '17' , style: { backgroundColor: 'black',textColor: 'white' } },
    { option: '34' , style: { backgroundColor: 'red',textColor: 'white' } },
    { option: '6' , style: { backgroundColor: 'black',textColor: 'white' } },
    { option: '27' , style: { backgroundColor: 'red',textColor: 'white' } },
    { option: '13' , style: { backgroundColor: 'black',textColor: 'white' } },
    { option: '36' , style: { backgroundColor: 'red',textColor: 'white' } },
    { option: '11' , style: { backgroundColor: 'black',textColor: 'white' } },
    { option: '30' , style: { backgroundColor: 'red',textColor: 'white' } },
    { option: '8' , style: { backgroundColor: 'black',textColor: 'white' } },
    { option: '23' , style: { backgroundColor: 'red',textColor: 'white' } },
    { option: '10' , style: { backgroundColor: 'black',textColor: 'white' } },
    { option: '5' , style: { backgroundColor: 'red',textColor: 'white' } },
    { option: '24' , style: { backgroundColor: 'black',textColor: 'white' } },
    { option: '16' , style: { backgroundColor: 'red',textColor: 'white' } },
    { option: '33' , style: { backgroundColor: 'black',textColor: 'white' } },
    { option: '1' , style: { backgroundColor: 'red',textColor: 'white' } },
    { option: '20' , style: { backgroundColor: 'black',textColor: 'white' } },
    { option: '14' , style: { backgroundColor: 'red',textColor: 'white' } },
    { option: '31' , style: { backgroundColor: 'black',textColor: 'white' } },
    { option: '9' , style: { backgroundColor: 'red',textColor: 'white' } },
    { option: '22' , style: { backgroundColor: 'black',textColor: 'white' } },
    { option: '18' , style: { backgroundColor: 'red',textColor: 'white' } },
    { option: '29' , style: { backgroundColor: 'black',textColor: 'white' } },
    { option: '7' , style: { backgroundColor: 'red',textColor: 'white' } },
    { option: '28' , style: { backgroundColor: 'black',textColor: 'white' } },
    { option: '12' , style: { backgroundColor: 'red',textColor: 'white' } },
    { option: '35' , style: { backgroundColor: 'black',textColor: 'white' } },
    { option: '3' , style: { backgroundColor: 'red',textColor: 'white' } },
    { option: '26' , style: { backgroundColor: 'black',textColor: 'white' } },

  ]
  const outerBorderWidth = 15;
  const innerRadius = 35;
  const innerBorderWidth = 25;
  const radiusLineColor = "yellow"
  const radiusLineWidth = 2;
  const textDistance = 75;
  const perpendicularText = true;

const RouleteWheel = forwardRef((props, ref) => {
  const [mustSpin, setMustSpin] = useState(false);
  const [prizeNumber, setPrizeNumber] = useState(0);

  useImperativeHandle(ref, () => ({

    handleSpinClick() {
        console.log(prizeNumber);
        const newPrizeNumber = Math.floor(Math.random() * data.length)
        setPrizeNumber(newPrizeNumber)
        setMustSpin(true)
    }

  }));

  return (
    <>
      <Wheel
        mustStartSpinning={mustSpin}
        prizeNumber={prizeNumber}
        data={data}
        outerBorderWidth = {outerBorderWidth}
        innerRadius = {innerRadius}
        innerBorderWidth = {innerBorderWidth}
        radiusLineColor = {radiusLineColor}
        radiusLineWidth = {radiusLineWidth}
        textDistance = {textDistance}
        perpendicularText = {perpendicularText}

        onStopSpinning={() => {
          setMustSpin(false)
        }}
      />
    </>
  )
});

export default RouleteWheel;