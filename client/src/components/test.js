describe('AddMenuItemForm Component', () => {
    it('should add a menu item successfully', async () => {
      const onAddMenuItemMock = jest.fn();
      render(<AddMenuItemForm onAddMenuItem={onAddMenuItemMock} />);
  
      mockAxios.onPost('http://localhost:5001/menu/add').reply(201, {
        success: true,
        menuItem: { name: 'Test Item' },
      });

      fireEvent.change(screen.getByLabelText(/name/i), { target: { value: 'Test Item' } });
      fireEvent.change(screen.getByLabelText(/description/i), { target: { value: 'Test Description' } });
      fireEvent.change(screen.getByLabelText(/price/i), { target: { value: 10 } });
      fireEvent.change(screen.getByLabelText(/category/i), { target: { value: 'Test Category' } });
      fireEvent.click(screen.getByText(/add menu item/i));

      await waitFor(() => {
        expect(onAddMenuItemMock).toHaveBeenCalledWith({ name: 'Test Item' });
      });
    });
  
    it('should handle error while adding a menu item', async () => {
      render(<AddMenuItemForm onAddMenuItem={() => {}} />);
  
      mockAxios.onPost('http://localhost:5001/menu/add').reply(500, {
        success: false,
        error: 'Internal Server Error',
      });
  
      fireEvent.click(screen.getByText(/add menu item/i));
  
      await waitFor(() => {
        expect(screen.getByText(/error adding menu item/i)).toBeInTheDocument();
      });
    });
  });