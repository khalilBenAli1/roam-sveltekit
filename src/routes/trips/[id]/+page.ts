import { error } from '@sveltejs/kit';
export function entries() {
  return [{ id: 'kyoto' }, { id: 'lisbon' }, { id: 'dolomites' }];
}
export function load({ params }: { params: { id: string } }) {
  if (!['kyoto', 'lisbon', 'dolomites'].includes(params.id))
    error(404, 'This chapter hasn’t been written.');
  return { id: params.id };
}
