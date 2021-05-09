import './App.css';
import { Svg } from './Svg'
import { useEffect, useState, useRef} from 'react';
import { randomNormal, range, max, min } from 'd3'

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
const generateData = (num, redX, redY, blueX, blueY) => {
  const data = range(num).map((element, index) => {
    if (index < num/2) {
      //red circle in first quadrant
      return { 
        x: redX(),
        y: redY(),
        r: 4, 
        fill: '#ff9999',
        stroke: '#660000',
        key: index
      }
    } else {
      //blue circle in third quadrant
      return { 
        x: blueX(), 
        y: blueY(), 
        r: 4, 
        fill: "#80d0ff",
        stroke: '#002db3',
        key: index
      }
    }
    }).sort((a, b) => (a.key - b.key))
    return data
}
const initialData = generateData(
                      400,
                      () => max([0, randomNormal(3.5, 1.5)()]),
                      () => max([0, randomNormal(3.5, 1.5)()]),
                      () => min([0, randomNormal(-3, 1.5)()]),
                      () => min([0, randomNormal(-3, 1.5)()]))
const secondData = generateData(
                      400,
                      () => max([0.1, randomNormal(3.5, 1.5)()]) +1,
                      () => randomNormal(0, 3)(),
                      () => min([-0.1, randomNormal(-3, 1.5)()]) + 1,
                      () => randomNormal(0, -3)()
                      )
function App() {
  const [data, setData] = useState(initialData)
  const [ref, visible] = useOnScreen({threshold: 1})
  
  // useEffect(() => {
  //   if (visible) {
  //     setData(data => data.sort((a,b)=>a.key-b.key).map((datum, index) => ({...datum, y: initialData[datum.key].y })))
  //   }
  // }, [visible])
  useEffect(() => {
    if (visible) {
      setData(data => secondData)
    }
  }, [visible])

  const reduceToXAxis = () => {
    setData(data.map((circle) => ( {...circle, y: 0} )))
  }

  const transformToYAxis = () => {
    setData(data.map(circle => ({...circle, y: circle.x, x:0})))
  }
 
  const shiftByConstant = (inputX, inputY) => {
    setData(data.map(circle => ({...circle, x: circle.x + inputX, y: circle.y + inputY})))
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
            If you're not already familiar with how matrices encode linear transformations, <a href="https://www.youtube.com/watch?v=kYB8IZa5AuE">here</a>'s an excellent video by Grant Sanderson.
          </p>   
        </div>
        <div className="card">
          <p>
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
            What about the second column? Remember that the second column maps our original y-coordinates. Let's look at the point (0, 1) before the transformation, and notice that it gets mapped to (0, 0). So our second column of <b>A</b> is (0, 0).
          </p>
        </div>
        <div className="card" ref={ref} >
          <p>Let's spread the data around again and look at a more complicated example.</p>
        </div>
        <div className="card">
          <p>
            Suppose we wanted our classifier to give us a single value for whether a data point is red or blue.
            We input a circle's coordinates (2-dimensional) and get back either a positive or a negative value.
            One way we could go about building such a classifier is to find the right linear transformations that map our data in such a way, that we could simply read the results from the y-coordinate: let's choose red to be positive and blue to be negative. 
          </p>
        </div>
        <div className="card">
          <p>
            We'll break our linear transformation into two simpler ones to get very close to our desired result.
            We already saw the matrix that collapsed our circles to the x-axis, so let's try that one again:
          </p>
          <button onClick={reduceToXAxis}>⎡ 1 0 ⎤ <br/> ⎣ 0 0 ⎦</button> 
        </div>
        <div className="card">
          <p>
            Since our intention was to transform our points to the y-axis (though perhaps choosing our values from the x-axis would have been simpler), we'll have to rotate the x-axis to the y-axis:
          </p>
          <button onClick={transformToYAxis}>⎡ 0 0 ⎤ <br/> ⎣ 1 0 ⎦</button> 
          <br/><br/>
          <p>The second column of our transformation matrix is irrelevant here.</p>
        </div>
        <div className="card">
          <p>
            You might have noticed that our first transformation was completely redundant. 
            Since these were stricly linear transformations, we can just multiply the two matrices together and get one linear transformation representing both of them:
          </p>
            <button style={{"cursor": "default"}}>⎡ 0 0 ⎤<br/>⎣ 1 0 ⎦</button>
        </div>
        <div className="card">
          <p>
            We're almost there. 
            Our aim was to transform our data onto the y-axis in such a manner that the red circles would give a positive value, and the blue circles a negative one. 
            All we have to do now (by eyeballing the data) is shift our data down by 1. Let's add this bias to our layer:
          </p>
          <button onClick={() => shiftByConstant(0, -1)}>⎡ 0 ⎤<br/>⎣ -1 ⎦</button>
        </div>
        <div className="card">
          <p>
            Since we added the bias, our transformation is no longer a strictly linear one. 
            It's now called an affine transformation. <a href="https://www.youtube.com/watch?v=E3Phj6J287o">Here</a>'s a short video on  affine transformations and how they can be seen as linear ones. 
          </p>
        </div>
        <div className="card">
          <p>
            Next we'll look at data that would be impossible to separate with only these tools, and we'll get closer to the structure of a typical neural network.
          </p>
        </div>
      </div>
    </>
  )
}

export default App;
