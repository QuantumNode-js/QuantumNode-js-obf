local Vector2 = {}
Vector2.__index = Vector2

function Vector2.new(x, y)
  local self = setmetatable({}, Vector2)
  self.x = x
  self.y = y
  return self
end

function Vector2:magnitude()
  return math.sqrt(self.x * self.x + self.y * self.y)
end

function Vector2:__add(other)
  return Vector2.new(self.x + other.x, self.y + other.y)
end

local v1 = Vector2.new(3, 4)
local v2 = Vector2.new(1, 2)
local v3 = v1 + v2

print("v1 magnitude: " .. v1:magnitude())
print("v3: (" .. v3.x .. ", " .. v3.y .. ")")
