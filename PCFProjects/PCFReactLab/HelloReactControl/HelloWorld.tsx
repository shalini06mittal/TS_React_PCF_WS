import * as React from 'react';
import { Label, Button, Input, FluentProvider, webLightTheme } from '@fluentui/react-components';

export interface IHelloWorldProps {
  name?: string;
  onNameChange?: (name: string) => void;
}

export const HelloWorld: React.FC<IHelloWorldProps> = ({name, onNameChange}) => {
  
  const [inputValue, setInputValue] = React.useState<string|undefined>(name)

  React.useEffect(() => {
    setInputValue(name);
  }, [name]);
    return (
      <FluentProvider theme={webLightTheme}>
        
        <Input
          placeholder="Enter your name"
          value={inputValue}
          onChange={(e, data) =>setInputValue(data.value)}
        />
        <Button onClick={() => onNameChange?.(inputValue?? "" )}>
          Change Name
        </Button> 
      </FluentProvider>
    )
  }

