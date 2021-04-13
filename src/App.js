import './App.css';
import { Coordinate } from './Coordinate'
import { useEffect, useState, useRef} from 'react';
import { randomNormal, range } from 'd3'

// Intersection observer for scrolling behavior
function useOnScreen(options) {
  const ref = useRef()
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
        setVisible(entry.isIntersecting)
    }, options)

    if(ref.current) {
      observer.observe(ref.current)
    }

    return () => {
      if(ref.current) {
        observer.unobserve(ref.current)
      }
    }
  }, [ref, options])
  return [ref, visible]
}

// generate coordinates for circles
const generateData = (num) => {
  const initialData = range(num).map((element, index) => {
    if (index < num/2) {
      //red circle in first quadrant
      return { 
        x: randomNormal(3.5, 1.5)(),
        y: randomNormal(3.5, 1.5)(),
        r: 4, 
        fill: '#ff9999',
        stroke: '#660000',
        key: index
      }
    } else {
      //blue circle in third quadrant
      return { 
        x: randomNormal(-3, 1.5)(), 
        y: randomNormal(-3, 1.5)(), 
        r: 4, 
        fill: "#80d0ff",
        stroke: '#002db3',
        key: index
      }
    }
    }).sort((a, b) => (a.key - b.key))
    return initialData
}
const initialData = generateData(300)

function App() {
  const [data, setData] = useState(initialData)
  const [ref, visible] = useOnScreen({threshold: 1})
  
  useEffect(() => {
    if (visible) {
      setData(data => data.sort((a,b)=>a.key-b.key).map((datum, index) => ({...datum, y: initialData[datum.key].y })))
    }
  }, [visible])

  const reduceToXAxis = () => {
    setData(data.map((circle) => ( {...circle, y: 0} )))
  }
 
  return (
    <>
      <Coordinate data={data} visible={visible}/>
      <h1>Matrices, Linear Transformations & Deep Learning</h1>
        <div className="flex-container">       
          <div className="card">
            <p> 
              Linear transformations are an integral part of deep learning, 
              and matrix multiplication is how computers represent and compute linear transformations under the hood. 
              So what are linear transformations? 
            </p>   
          </div>
          <div className="card">
            <p>
              A linear transformation is a mapping from one vector space (<b>V</b>) to another (<b>W</b>), 
              that preserves vector addition and scalar multiplication. If we let <b>f</b> represent our mapping from <b>V</b> to <b>W</b>,
              then <b>f</b>(a+b)=<b>f</b>(a)+<b>f</b>(b) represents our first condition and <b>f</b>(c*a)=c*<b>f</b>(a) our second.
              <br/><br/>
              Here c is a scalar, a and b are members of <b>V</b>, and <b>f</b>(a) and <b>f</b>(b) are members of <b>W</b>.
            </p>   
          </div>
          <div className="card">
            <p>Linear transformations preserve some important pieces of structure. It doesn't matter whether we add our vectors before we transform them, or whether we add them up after our transformation - we'll end up in the same place. 
              Multiplying a vector by some number and then transforming it will give us the same result as transforming it first, and then multiplying it by the same number.
            </p>
          </div>
          <div className="card">
            <p>Let's see a linear transformation in action. Press the button and see how it affects the circles! </p>
            <button onClick={reduceToXAxis}>Linear Transformation</button> 
          </div>
          <div className="card">
            <p>Our transformation pushed all of the circles to the x-axis. Did it preserve our two conditions? If we add two points (circles) and take the x coordinate of that circle, is it the same as taking the x coordinates of the two original circles and adding them together? </p>
          </div>
          <div className="card" ref={ref} >
            <p>Let's put the circles back to where they started from and see how matrix multiplication ties into all of this.</p>
          </div>
        </div>
      </>
  )
}

export default App;
