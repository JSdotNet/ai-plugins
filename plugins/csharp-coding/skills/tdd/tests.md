# Good and bad tests — xUnit

## Behaviour through the public interface

```csharp
// GOOD: observable behaviour, real collaborators, named in the domain language
[Fact]
public async Task Checkout_is_confirmed_for_a_valid_cart()
{
    var cart = new Cart();
    cart.Add(Products.Coffee);

    var result = await _checkout.PlaceOrderAsync(cart, PaymentMethods.Card);

    Assert.Equal(OrderStatus.Confirmed, result.Status);
}

// BAD: verifies how, against a mock of an own collaborator
[Fact]
public async Task PlaceOrderAsync_ValidCart_CallsPaymentService()
{
    var payments = new Mock<IPaymentService>();
    var checkout = new CheckoutService(payments.Object);

    await checkout.PlaceOrderAsync(_cart, PaymentMethods.Card);

    payments.Verify(p => p.ProcessAsync(_cart.Total), Times.Once);
}
```

## Read back through the interface, not a side channel

```csharp
// BAD: bypasses the interface and asserts through the DbContext
[Fact]
public async Task CreateUserAsync_SavesToDatabase()
{
    await _users.CreateUserAsync(new NewUser("Alice"));

    Assert.NotNull(await _db.Users.SingleOrDefaultAsync(u => u.Name == "Alice"));
}

// GOOD: what was created can be retrieved
[Fact]
public async Task A_created_user_can_be_retrieved()
{
    var id = await _users.CreateUserAsync(new NewUser("Alice"));

    var user = await _users.GetUserAsync(id);

    Assert.Equal("Alice", user.Name);
}
```

## Independent expected values

```csharp
// BAD: tautological — the expected value is computed the way the code computes it
[Fact]
public void CalculateTotal_SumsLineItems()
{
    var items = new[] { new LineItem(10m), new LineItem(5m) };

    Assert.Equal(items.Sum(i => i.Price), Order.CalculateTotal(items));
}

// GOOD: a known literal
[Fact]
public void The_total_is_the_sum_of_the_line_items()
{
    Assert.Equal(15m, Order.CalculateTotal([new LineItem(10m), new LineItem(5m)]));
}
```

## Mock at the boundary

```csharp
// GOOD: time is a system boundary — inject TimeProvider, fake it in the test
[Fact]
public void A_reservation_expires_after_fifteen_minutes()
{
    var time = new FakeTimeProvider(new DateTimeOffset(2026, 1, 1, 12, 0, 0, TimeSpan.Zero));
    var reservation = Reservation.Hold(Seats.A1, time);

    time.Advance(TimeSpan.FromMinutes(15));

    Assert.True(reservation.IsExpired);
}
```

Adapted from [mattpocock/skills](https://github.com/mattpocock/skills) `skills/engineering/tdd`, MIT License, © 2026 Matt Pocock.
