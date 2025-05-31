export interface IPartSubComponent {
  id: string;
  quantity: number;
}

export interface IPartInput {
  name: string;
  type: 'RAW' | 'ASSEMBLED';
  quantity?: number;
  parts?: IPartSubComponent[];
}
