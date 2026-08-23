local function factorial(n)
  if n <= 1 then
    return 1
  end
  return n * factorial(n - 1)
end

print("Factorial(5) = " .. factorial(5))
print("Factorial(10) = " .. factorial(10))
