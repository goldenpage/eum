const List = ({item}: {item: string}) => {
  return (
    <>
      <ul style={{listStyle: 'none'}}>
        <li>{item}</li>
      </ul>
    </>
  );
};

export default List;
