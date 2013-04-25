class Game < ActiveRecord::Base
  attr_accessible :colors, :details_id, :height, :width

  # validates :colors, :presence => true
end
