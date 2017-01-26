import type { Description } from '/data/character';
import TextField from 'material-ui/TextField';

export function ViewDescription({ description } : { description: Description }) {
  switch (description.type) {
    case 'IMAGE':
      return <img src={description.url} />;
    case 'TEXT':
        return <div>{description.value}</div>
  }
}

export function EditDescription({ description, onSave } : { description: ?Description, onSave: (d: Description) => void }) {
  description = description || { type: 'TEXT', value: '' };
  switch (description.type) {
    case 'IMAGE':
      return <img src={description.url} />;
    case 'TEXT':
      return <TextField defaultValue={description.value} />
  }
}