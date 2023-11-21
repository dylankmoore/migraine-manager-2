import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import PropTypes from 'prop-types';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';
import { Button } from 'react-bootstrap';
import { useAuth } from '../../utils/context/authContext';
import { getLogs, updateLog, createLog } from '../../api/LogData';

const initialState = {
  painLevel: '',
  sleep: '',
  food: '',
  exercise: '',
  notes: '',
};

// function to render the create a log form
function LogForm({ obj }) {
  const [formInput, setFormInput] = useState(initialState);
  const [setLog] = useState([]);
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    getLogs(user.uid).then(setLog);

    if (obj.firebaseKey) setFormInput(obj);
  }, [obj, user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormInput((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // function to re render the log history upon submit
  const handleSubmit = (e) => {
    e.preventDefault();
    if (obj.firebaseKey) {
      updateLog(formInput).then(() => router.push('/LogHistory'));
      console.warn('creating');
    } else {
      const payload = { ...formInput, uid: user.uid };
      createLog(payload).then(({ name }) => {
        const patchPayload = { firebaseKey: name };
        updateLog(patchPayload).then(() => {
          router.push('/LogHistory');
        });
      });
    }
  };

  // add/edit member form
  return (
    <div id="form">
      <Form onSubmit={handleSubmit}>
        <h1 className="text-black mt-5">Create A Log:</h1><hr />

        {/* NAME INPUT  */}
        Name:
        <FloatingLabel controlId="floatingInput1" label="" className="mb-3">
          <Form.Control
            type="text"
            placeholder="name"
            name="name"
            value={formInput.name}
            onChange={handleChange}
            required
          />
        </FloatingLabel>
        {/* SLEEP INPUT  */}
        Hours Slept:
        <FloatingLabel controlId="floatingInput1" label="" className="mb-3">
          <Form.Control
            type="text"
            placeholder="Enter hours slept"
            name="sleep"
            value={formInput.sleep}
            onChange={handleChange}
            required
          />
        </FloatingLabel>

        {/* FOOD INPUT  */}
        Food consumed:
        <FloatingLabel controlId="floatingInput2" label="" className="mb-3">
          <Form.Control
            type="text"
            placeholder="Enter food consumed"
            name="food"
            value={formInput.food}
            onChange={handleChange}
            required
          />
        </FloatingLabel>

        {/* EXERCISE INPUT  */}
        Exercise:
        <FloatingLabel controlId="floatingInput3" label="" className="mb-3">
          <Form.Control
            type="text"
            placeholder=""
            name="exercise"
            value={formInput.exercise}
            onChange={handleChange}
            required
          />
        </FloatingLabel>
        <Button id="logform" type="submit">{obj.firebaseKey ? 'Update' : 'Create'} Log</Button>
      </Form>
    </div>
  );
}

LogForm.propTypes = {
  obj: PropTypes.shape({
    name: PropTypes.string,
    sleep: PropTypes.string,
    food: PropTypes.string,
    exercise: PropTypes.string,
    firebaseKey: PropTypes.string,
    notes: PropTypes.string,

  }),
};

LogForm.defaultProps = {
  obj: initialState,
};

export default LogForm;
