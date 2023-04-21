import React from 'react';


export type AttachProps = {
  value: boolean; onChange(value: boolean): void;
}

export function Attach(props: AttachProps) {
  return (
    <label title="Закрепить результат поиска за этой страницей">
      <input
        type="checkbox"
        checked={props.value}
        onChange={e => props.onChange(e.target.checked)}
        style={{
          margin: '0 6px 0 0', verticalAlign: 'text-bottom'
        }}
      />
      Закрепить
    </label>
  )
}

