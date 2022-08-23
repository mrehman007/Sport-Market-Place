import React, { useState } from 'react';
import { Fragment } from 'react';
import Input from './FormElements/Input';
import Label from './FormElements/Label';
import styled from 'styled-components';
import Button from './Button';

const AddProperties = ({ formData, setFormData }) => {
  const { properties } = formData;

  const [countFields, setCountFields] = useState([{ count: 0 }]);
  const [lastCount, setLastCount] = useState(0);

  const onAdd = (e) => {
    e.preventDefault();
    const lastFieldCount = countFields[countFields.length - 1].count; // last property Count Value
    setCountFields([...countFields, { count: lastFieldCount + 1 }]);
    setFormData({
      ...formData,
      properties: [...properties],
    });
    setLastCount(lastFieldCount + 1);
  };

  const onSubtract = (e) => {
    e.preventDefault();
    const allFields = countFields;
    allFields.pop(); // delete last value
    setCountFields([...allFields]);
    formData.properties.pop();
    setFormData({ ...formData });

    const lastGradFieldCount = countFields[countFields.length - 1].count; // last Asset Value
    setLastCount(lastGradFieldCount);
  };

  const onChangeProperties = (e, key, rowCount) => {
    let value = e.target.value;
    let newValue = properties;
    // newValue[rowCount] = {
    //     // ...properties[rowCount],
    //     [key]: value,
    // };
    properties[rowCount] = {
      [key]: value,
    };

    setFormData({
      ...formData,
      properties,
    });
  };

  return (
    <>
      <Fragment>
        <StyledProperties>
          {countFields.map((item) => (
            <Fragment key={item.count}>
              <div className="grid">
                <div>
                  <Label className={`sign__label`} htmlFor="type">
                    Trait Type
                  </Label>
                  <Input
                    id="trait_type"
                    type="text"
                    name="trait_type"
                    className={`sign__input`}
                    placeholder="Enter trait type"
                    value={properties[item.count]?.trait_type || ''}
                    onChange={(e) => onChangeProperties(e, item.count)}
                  />
                </div>

                <div>
                  <Label className={`sign__label`} htmlFor="name">
                    Value
                  </Label>
                  <Input
                    id="value"
                    type="text"
                    name="value"
                    className={`sign__input`}
                    placeholder="Enter value"
                    value={properties[item.count]?.value || ''}
                    onChange={(e) => onChangeProperties(e, item.count)}
                  />
                </div>
              </div>

              {item.count === lastCount && (
                <div className="manupulation-btns">
                  <Button onClick={onAdd}>Add Field</Button>
                  {item.count !== 0 && (
                    <Button onClick={onSubtract} primary>
                      Delete Field{' '}
                    </Button>
                  )}
                </div>
              )}
            </Fragment>
          ))}
        </StyledProperties>
      </Fragment>
    </>
  );
};

export default AddProperties;

const StyledProperties = styled.div`
  .grid {
    margin-top: 1rem;
    display: grid;
    gap: 1rem;
    grid-template-columns: repeat(2, 1fr);

    @media (max-width: 768px) {
      grid-template-columns: repeat(1, 1fr);
    }
  }

  .manupulation-btns {
    display: grid;
    gap: 1rem;
    grid-template-columns: repeat(4, 1fr);
    margin-top: 1rem;
    @media (max-width: 810px) {
      grid-template-columns: repeat(3, 1fr);
    }

    @media (max-width: 632px) {
      button {
        padding: 10px;
      }
    }
  }
`;
