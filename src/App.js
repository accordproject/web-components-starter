import React, { useState } from 'react';
import ConcertFormDemo from './ConcertoFormDemo';
import MarkdownEditorDemo from './MarkdownEditorDemo';
import styled from 'styled-components';

const Button = styled.button`
  margin: 5px;
`;

/**
 * Starter App
 */
export const App = () => {
  const [view, setView] = useState('editor')
  return (
    <div style={{ padding: '50px' }}>
      <h1>Welcome to the Web Components Starter App</h1>
        <Button onClick={() => setView('editor')}>View Markdown Editor Demo</Button>
        <Button onClick={() => setView('form')}>View Concerto Form Demo</Button>
      <hr />
      { view === 'editor' && <MarkdownEditorDemo /> }
      { view === 'form' && <ConcertFormDemo /> }
    </div>
  )
}

export default App;
