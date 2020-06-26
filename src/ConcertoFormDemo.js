/* eslint-disable require-jsdoc */
/*
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import React, { useState } from 'react';
import './App.css';
import { ConcertoForm } from '@accordproject/ui-concerto';
import { Grid, Segment, Form, Dropdown } from 'semantic-ui-react';
import ConcertoEditor from './ConcertoEditor';
import MonacoEditor from 'react-monaco-editor';

const ConcertoFormDemo = (props) => {
  // Source model file text
  const [model, setModel] = useState(`namespace io.clause.demo.fragileGoods

import org.accordproject.cicero.contract.* from https://models.accordproject.org/cicero/contract.cto
import org.accordproject.cicero.runtime.* from https://models.accordproject.org/cicero/runtime.cto
import org.accordproject.time.Duration from https://models.accordproject.org/v2.0/time.cto
import org.accordproject.money.MonetaryAmount from https://models.accordproject.org/money.cto

/**
 * The status of a shipment
 */
enum ShipmentStatus {
  o CREATED
  o IN_TRANSIT
  o ARRIVED
}

transaction DeliveryUpdate extends Request {
  o DateTime startTime
  o DateTime finishTime optional
  o ShipmentStatus status
  o Double[] accelerometerReadings
}

transaction PayOut extends Response {
  o MonetaryAmount amount
}

/**
 * The template model
 */
asset FragileGoodsClause extends AccordContract {
  o AccordParty buyer
  o AccordParty seller
  o MonetaryAmount deliveryPrice
  o Double accelerationMin
  o Double accelerationMax
  o MonetaryAmount accelerationBreachPenalty
  o Duration deliveryLimitDuration
  o MonetaryAmount lateDeliveryPenalty
}`);

  // Rendering options
  const options = {
    includeOptionalFields: true,

    // The default values for a generated form if a JSON serialization isn't provided
    // 'sample' uses random well-typed values
    // 'empty' provides sensible empty values
    includeSampleData: 'sample', // or 'empty'

    updateExternalModels: true,
    hiddenFields: [
      'org.accordproject.base.Transaction.transactionId',
      'org.accordproject.cicero.contract.AccordContract.contractId',
      'org.accordproject.cicero.contract.AccordClause.clauseId',
      'org.accordproject.cicero.contract.AccordContractState.stateId',
    ],
  };

  const [json, setJson] = useState(null);

  // The Fully Qualified Name of the type that the form generates
  const [fqn, setFqn] = useState('');

  // The list of types in the model manager that can have a form generated
  const [types, setTypes] = useState([]);

  const safeStringify = (jsonObject) => {
    try {
      if (typeof jsonObject === 'object') {
        return JSON.stringify(jsonObject, null, 2);
      }
      return JSON.stringify(JSON.parse(jsonObject), null, 2);
    } catch (err){
      return jsonObject;
    }
  };

  const handleJsonTextAreaChange = (value) => {
    setJson(safeStringify(value));
  };

  const onModelChange = ({ types, json }) => {
    setTypes(types);
    setJson(safeStringify(json));

    // Set default value
    if (fqn === '' && types && types.length > 0){
      setFqn(types[0].fqn);
    }
  };

  const onValueChange = (jsonObj) => {
    setJson(safeStringify(jsonObj));
  };

  return (
    <div className="App">
      <h2>Concerto Form Generator - Demo Client</h2>
      <p>This tool demonstrates the <em>ui-concerto</em> library to generate a form from an Accord Project Concerto model.</p>
      <p>This demo produces a ReactJS form that is styled with Semantic UI.</p>
      <Grid columns={2} divided style={{ height: '100%' }} verticalAlign='top' >
        <Grid.Row stretched>
          <Grid.Column>
            <Segment>
              <label>Model</label>
              <ConcertoEditor
                handleSubmit={setModel}
                textValue={model}
              />
            </Segment>
            <Segment>
              <label>JSON</label>
              <MonacoEditor
                height='400'
                options={{
                  minimap: {
                    enabled: false,
                  },
                }}
                language='json'
                theme='vs-light'
                value={json}
                onChange={handleJsonTextAreaChange}
              />
            </Segment>
          </Grid.Column>
          <Grid.Column>
            <Segment>
              <h2>Form</h2>
              <ConcertoForm
                onModelChange={onModelChange}
                onValueChange={onValueChange}
                type={fqn}
                models={[model]}
                json={json}
                options={options}
              />
            </Segment>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </div>
  );
}

export default ConcertoFormDemo;
