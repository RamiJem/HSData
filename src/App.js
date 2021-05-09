import './App.css';
import { Svg } from './Svg'
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
      <Svg data={data} visible={visible}/>
      <h1>Matrices, Linear Transformations & Deep Learning</h1>
        <div className="flex-container">       
          <div className="card">
            <p> 
              Let's use a very simplified neural net as our starting point to see how finding the right weights for our inputs is analogous to finding the right linear transformations to classify our data.
              We'll start off with something very simple: a <a href="https://en.wikipedia.org/wiki/Linear_classifier">linear classifier</a>. 
              We'll motivate the need for non-linearities and the usefulness of adding layers later on.
            </p>   
          </div>
          <div className="card">
            <p>
              If you're not already familiar with how matrices encode linear transformations, here's an excellent <a href="https://www.youtube.com/watch?v=kYB8IZa5AuE">video</a> by Grant Sanderson.
              If we start off with the coordinate system we're all used to from school, we can think of a matrix multplication by some 2x2 matrix <b>A</b> as taking the unit vector along the x-axis to the first column of our matrix <b>A</b>  and taking the unit vector along the y-axis to the second column of our matrix <b>A</b>. If you find this confusing, go and watch the video!
            </p>   
          </div>
          <div className="card">
            <p>Let's see a linear transformation in action. Press the button and see how it affects the circles! </p>
            <button onClick={reduceToXAxis}>Linear Transformation</button> 
          </div>
          <div className="card">
            <p>
              Our transformation pushed all of the circles to the x-axis. What would the matrix representation of this linear transformation look like? Our x-coordinates stayed the same, so the first column of our matrix is (1, 0). 
              What about the second column? Remember that the second column maps our original y-coordinates. Let's look at the point (0, 1) before our transformation, and notice that it gets mapped to (0, 0) by our transformation. So our second column of <b>A</b> is (0, 0).
            </p>
          </div>
          <div className="card" ref={ref} >
            <p>Let's put the circles back to where they started from and look at a more complicated example.</p>
          </div>
        </div>
      </>
  )
}

export default App;
